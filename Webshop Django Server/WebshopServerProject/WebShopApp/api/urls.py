from django.urls import path
from django.middleware import csrf
from django.http import JsonResponse
from WebShopApp.api.views import ShopItemListAPI_V1, ShopItemDetailAPI_V1, PopulateDatabase, FilteredShopItemListAPI, DeleteItemDB


def get_csrf_token(request):
    csrf_token = csrf.get_token(request)
    return JsonResponse({'csrfToken': csrf_token})


urlpatterns = [
    path('shopItems/', ShopItemListAPI_V1.as_view()),
    path('shopItems/<int:item_id>/', ShopItemDetailAPI_V1.as_view()),
    path('shopItems/<str:searchTerm>/', FilteredShopItemListAPI.as_view()),
    path('shopItems/populateDB/', PopulateDatabase.as_view()),
    path('shopItems/deleteItemDB/', DeleteItemDB.as_view()),
    path('csrfToken/', get_csrf_token, name='get_csrf_token')
]