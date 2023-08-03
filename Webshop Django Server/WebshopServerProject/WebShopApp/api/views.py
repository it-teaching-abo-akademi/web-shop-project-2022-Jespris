import random

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from WebShopApp.models import ShopItem
from WebShopApp.api.serializers import ShopItemSerializer
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
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


class FilteredShopItemListAPI(ListAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]
    pagination_class = ShopItemPagination
    serializer_class = ShopItemSerializer
    queryset = ShopItem.objects.filter(sold=False).order_by('date').reverse()

    def get(self, request, *args, **kwargs):
        searchTerm = self.kwargs.get('searchTerm', '')
        querySet = self.get_queryset().filter(name__icontains=searchTerm)
        page = self.paginate_queryset(querySet)
        if page:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        return Response([])


class ShopItemDetailAPI_V1(GenericAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def get(self, request, item_id):
        shopItem = get_object_or_404(ShopItem, pk=item_id)
        serializer = ShopItemSerializer(shopItem)
        return Response(serializer.data)

    def put(self, request, item_id):
        shopItem = get_object_or_404(ShopItem, pk=item_id)
        serializer = ShopItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        shopItem.name = data["name"]
        shopItem.description = data["description"]
        shopItem.price = data["price"]
        shopItem.username = data["username"]
        shopItem.save()

        return Response({"message": "Card updated!"})

    def delete(self, request, item_id):
        shopItem = get_object_or_404(ShopItem, pk=item_id)
        shopItem.delete()

        return Response({"message": "Shop item deleted!"})


# Keyword delete seems to be blocking post request by something?!?
class DeleteItemDB(GenericAPIView):
    def get(self, request):
        # some security to not accidentally delete all items maybe idk?
        password = request.data.get('password', 0)
        if password == "verySecureDatabase":
            print("Deleting shop item database!")
            # TODO: filter out sold items and make a new API to get sold items?
            ShopItem.objects.all().delete()
            return Response({"message": "Item database deleted!"})
        return Response({"message": "Failed to delete item database"})


class PopulateDatabase(GenericAPIView):
    authentication_classes = [AllowAny]

    def post(self, request):
        # Get the 'number' value from the request.data dictionary
        number_of_items = int(request.data.get('number', 0))
        user = request.data.get('username', 0)

        print(f"Requested to add {number_of_items} items to database by user {user}\n")

        all_items = {
            "T-shirt": "Plain white T-Shirt",
            "Smartphone": "Old, barely working phone with cracked screen",
            "Laptop": "This laptop is from 2005 but works like a charm 100% of the time, 20% of the time",
            "Shoes": "Smells nice",
            "Book": "This book is 690 pages long and boring",
            "Watch": "You would look very cool in this watch",
            "Headphones": "Left earphone is broken",
            "Jewelry": "Shiny!",
            "Handbag": "Totally legit not counterfit Gucci handbag",
            "Sunglasses": "Cool guys wear sunglasses, are you a cool guy?",
            "Camera": "Very good selfie machine",
            "Toys": "Toys for 3-6 year olds",
            "Painting": "A painting I made myself, please support your local artists",
            "Toaster": "It's a toaster that works, what more could you want",
            "Yoga mat": "I broke my leg so I can no longer do the splits",
            "FIFA 19": "Please continue my save game",
            "Make-up bag": "I found this at my local club",
            "Phone charger": "This cable doesn't work but I guarantee it is of some use to someone probably",
            "Coffee table": "I spilled coffee on it",
            "Scratch tree for cat": "Your cat will love it!"
        }

        for key, value in all_items.items():
            name = key
            price = random.random() * 100
            description = value
            shopItem = ShopItem(name=name, description=description, price=price, username=user)
            shopItem.save()

        return Response({"message": f"Database populated with {number_of_items} items"})

