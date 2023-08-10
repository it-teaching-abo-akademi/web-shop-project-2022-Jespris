from rest_framework import serializers
from WebShopApp.models import ShopItem


class ShopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = ("pk", "name", "description", "price", "username", "date", "version", "purchased_by")
