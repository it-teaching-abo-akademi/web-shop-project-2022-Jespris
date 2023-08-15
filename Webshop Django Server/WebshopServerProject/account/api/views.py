import random

from rest_framework.views import APIView
from account.api.serializers import RegisterUser, UserSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from WebShopApp.models import ShopItem


class UserListAPI(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        token = request.data.get("token", 0)
        try:
            user = Token.objects.get(key=token).user
            return Response({"username": user.username, "email": user.email})
        except Exception as e:
            print("Failed getting user by token", e)
            return Response({})





"""
class LoginUserAPI(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = authenticate(email=data["email"], password=data["password"])
        if user is not None:
            print("User found! Login successful!")
            print("User: ", user)
        else:
            print("User login failed")
"""


class RegisterUserAPI_V1(APIView):
    def post(self, request):
        serializer = RegisterUser(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"]
        )
        Token.objects.create(user=user)
        user_serializer = UserSerializer(user)

        return Response(user_serializer.data)


class PopulateDB(APIView):
    def get(self, request):
        # Hard coded to delete all users, items and repopulate with 6 users,
        # where 3 of them have 10 items each (as per requirements)
        # Everything is in this mega get method to hopefully speed up things
        # Delete all the things
        print("Users pre deletion: ", User.objects.all())
        User.objects.all().delete()
        print("Users post deletion: ", User.objects.all())

        print("Items pre deletion: ", ShopItem.objects.all())
        ShopItem.objects.all().delete()
        print("Items post deletion: ", ShopItem.objects.all())

        # random items to populate with
        all_items = {
            "T-shirt": ("Plain white T-Shirt", "t-shirt.jpg"),
            "Smartphone": ("Old, barely working phone with cracked screen", "phone.jpg"),
            "Laptop": ("This laptop is from 2005 but works like a charm 100% of the time, 20% of the time", "laptop.jpg"),
            "Shoes": ("Smells nice", "shoes.jpg"),
            "Book": ("This book is 690 pages long and boring", "book.jpg"),
            "Watch": ("You would look very cool in this watch", "watch.jpg"),
            "Headphones": ("Left earphone is broken", "headphones.jpg"),
            "Jewelry": ("Shiny!", "jewelry.jpg"),
            "Handbag": ("Totally legit not counterfit Gucci handbag", "handbag.jpg"),
            "Sunglasses": ("Cool guys wear sunglasses, are you a cool guy?", "sunglasses.jpg"),
            "Camera": ("Very good selfie machine", "camera.jpg"),
            "Toys": ("Toys for 3-6 year olds", "toys.jpg"),
            "Painting": ("A painting I made myself, please support your local artists", "painting.jpg"),
            "Toaster": ("It's a toaster that works, what more could you want", "notImplemented.png"),
            "Yoga mat": ("I broke my leg so I can no longer do the splits", "notImplemented.png"),
            "FIFA 19": ("Please continue my save game", "notImplemented.png"),
            "Make-up bag": ("I found this at my local club", "notImplemented.png"),
            "Phone charger": ("This cable doesn't work but I guarantee it is of some use to someone probably", "notImplemented.png"),
            "Coffee table": ("I spilled coffee on it", "notImplemented.png"),
            "Scratch tree for cat": ("Your cat will love it!", "notImplemented.png")
        }

        # Add users
        for i in range(6):
            user = User.objects.create_user(
                username="testuser"+str(i),
                email="testuser"+str(i)+"@shop.aa",
                password="pass"+str(i)
            )
            user.save()
            Token.objects.create(user=user)

            # Create 10 items for 3 users
            if i < 3:
                for k in range(10):
                    key, value = random.choice(list(all_items.items()))
                    name = key
                    price = random.random() * 100
                    description = value[0]
                    image = value[1]
                    shopItem = ShopItem(name=name, description=description, price=price, username=user.username, image=image)
                    shopItem.save()

        print("Users created: ", User.objects.all())
        print("Items created: ", ShopItem.objects.all())

        return Response({"message": "Database repopulated with "})
