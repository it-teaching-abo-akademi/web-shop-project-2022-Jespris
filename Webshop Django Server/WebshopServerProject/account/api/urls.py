from django.urls import path
from account.api.views import RegisterUserAPI_V1, PopulateUserDB, UserListAPI
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('register/', RegisterUserAPI_V1.as_view()),
    path('populateUserDB/', PopulateUserDB.as_view()),
    path('login/', obtain_auth_token),
    path('users/', UserListAPI.as_view())
]