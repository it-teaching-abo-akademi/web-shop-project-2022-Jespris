from django.db.models import Q
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from WebShopApp.models import ShopItem
from WebShopApp.api.serializers import ShopItemSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.authentication import TokenAuthentication


class ShopItemPagination(PageNumberPagination):
    page_size = 10  # Number of items per page


class ShopItemListAPI_V1(ListAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]
    pagination_class = ShopItemPagination
    serializer_class = ShopItemSerializer
    queryset = ShopItem.objects.filter(sold=False).order_by('date').reverse()

    def list(self, request, *args, **kwargs):
        querySet = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(querySet)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        return Response([])  # nothing on page

    def post(self, request):
        serializer = ShopItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        shopItem = ShopItem(
            name=data["name"],
            description=data["description"],
            price=float(data["price"]),
            username=data["username"]
        )
        shopItem.save()
        return Response({"message": "Item added!"})


class UserShopItemsAPI_V1(ListAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]
    serializer_class = ShopItemSerializer
    queryset = ShopItem.objects.order_by('date').reverse()

    def get(self, request, *args, **kwargs):
        user = self.kwargs.get('userName', '')
        purchased_by = self.kwargs.get('purchasedBy', '')

        querySet = self.get_queryset().filter(
            Q(username=user) | Q(purchased_by=purchased_by)
        )  # use Q objects to combine filters

        is_sold = self.kwargs.get('sold', 0)
        if is_sold == 1:
            querySet = querySet.filter(sold=True)
        else:
            querySet = querySet.filter(sold=False)

        serializer = self.get_serializer(querySet, many=True)
        print("User shop items: ", serializer.data)

        return Response(serializer.data)


class FilteredShopItemListAPI(ListAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]
    pagination_class = ShopItemPagination
    serializer_class = ShopItemSerializer
    queryset = ShopItem.objects.filter(sold=False).order_by('date').reverse()

    def get(self, request, *args, **kwargs):
        searchTerm = self.kwargs.get('searchTerm', '')
        querySet = self.get_queryset().filter(name__contains=searchTerm)
        page = self.paginate_queryset(querySet)
        if page:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        return Response([])


class ShopItemGetIDAPI(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        name = self.kwargs.get('name', '')
        price = self.kwargs.get('price', '')
        username = self.kwargs.get('username', '')
        print("Got specifiers: ", name, price, username)
        item_id = ShopItem.objects.only('id').get(name=name, price=float(price), username=username)
        serializer = ShopItemSerializer(item_id)
        return Response(serializer.data)


class ShopItemUpdateAPI_V1(generics.UpdateAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]
    queryset = ShopItem.objects.all()
    serializer_class = ShopItemSerializer

