from rest_framework.views import APIView
from account.api.serializers import RegisterUser, UserSerializer, LoginSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate


class UserListAPI(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        token = request.data.get("token", 0)
        user = Token.objects.get(key=token).user
        return Response({"username": user.username, "email": user.email})




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


class PopulateUserDB(APIView):
    def post(self, request):
        print("Pre deletion: ", User.objects.all())
        User.objects.all().delete()
        print("Post deletion: ", User.objects.all())
        nr = int(request.data.get('number', 0))
        assert nr <= 10
        for i in range(nr):
            user = User.objects.create_user(
                username="testuser#"+str(i),
                email="testuser#"+str(i)+"@shop.aa",
                password="pass#"+str(i)
            )
            Token.objects.create(user=user)

        return Response({"message": f"User database populated with {nr} test users"})


