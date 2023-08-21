from django.contrib.auth.models import User
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
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from django.core.mail import EmailMessage


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
            price=float(data["price"]),
            username=data["username"]

        )

        if data["description"] != "":
            shopItem.description = data["description"]
        if data["image"] is not None:
            shopItem.image = data["image"]
        else:
            shopItem.image = 'notImplemented.png'

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


class BuyShopItemAPI_V1(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]
    serializer_class = ShopItemSerializer

    def post(self, request, *args, **kwargs):
        itemID = self.kwargs.get('pk', '')
        purchasedBy = request.data['username']  # IDK if this works
        shopItem = get_object_or_404(ShopItem, pk=itemID)
        shopItem.sold = True
        shopItem.purchased_by = purchasedBy
        shopItem.version += 1
        shopItem.save()
        return Response({"message": "Item bought!"})


@api_view(['POST'])
def send_confirmation_email(request):
    # get user and items information
    user_username = request.data['username']
    user_email = request.data['email']
    item_list = request.data['items']  # Array of objects: {sellerName1: [item1, item2], sellerName2: [item3]...}
    print("Item list:", item_list)

    # Send email to item owners
    for key, value in item_list.items():
        print("Item key:", key, "Item value:", value)
        subject = 'Purchase Confirmation'
        message = f'{user_username} just purchased your items: {value}.'
        from_email = 'jesper@Webshop.com'
        recipient_list = [User.objects.get(username=key).email]

        email = EmailMessage(subject, message, from_email, recipient_list)
        email.send()

    # Send email to user purchasing items
    subject = 'Purchase Confirmation'
    message = f'Thank you for purchasing items: {item_list.values().join(", ")}.'
    from_email = 'jesper@Webshop.com'
    recipient_list = [user_email]

    email = EmailMessage(subject, message, from_email, recipient_list)
    print("Email about to be sent:", email)
    email.send()

    return Response({'message': 'Confirmation emails sent'})
