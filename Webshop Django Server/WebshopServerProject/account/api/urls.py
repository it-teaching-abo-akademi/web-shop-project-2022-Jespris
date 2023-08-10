from django.urls import path
from account.api.views import RegisterUserAPI_V1, PopulateDB, UserListAPI
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('auth/register/', RegisterUserAPI_V1.as_view()),
    path('populateDB/', PopulateDB.as_view()),
    path('auth/login/', obtain_auth_token),
    path('auth/users/', UserListAPI.as_view())
]