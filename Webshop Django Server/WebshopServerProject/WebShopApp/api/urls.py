from django.urls import path
from django.middleware import csrf
from django.http import JsonResponse
from WebShopApp.api.views import ShopItemListAPI_V1, ShopItemUpdateAPI_V1, FilteredShopItemListAPI, \
    UserShopItemsAPI_V1, ShopItemGetIDAPI, BuyShopItemAPI_V1


def get_csrf_token(request):
    csrf_token = csrf.get_token(request)
    return JsonResponse({'csrfToken': csrf_token})


urlpatterns = [
    path('shopItems/', ShopItemListAPI_V1.as_view()),
    path('shopItems/<int:pk>/', ShopItemUpdateAPI_V1.as_view(), name='shop-item-update'),
    path('shopItems/<str:searchTerm>/', FilteredShopItemListAPI.as_view()),
    path('shopItems/byUsername/<str:userName>/<int:sold>/', UserShopItemsAPI_V1.as_view()),
    path('shopItems/byPurchasedBy/<str:purchasedBy>/<int:sold>/', UserShopItemsAPI_V1.as_view()),
    path('shopItems/<str:name>/<str:price>/<str:username>/', ShopItemGetIDAPI.as_view()),
    path('shopItems/buy/<int:itemID>/', BuyShopItemAPI_V1.as_view()),
    path('csrfToken/', get_csrf_token, name='get_csrf_token')
]