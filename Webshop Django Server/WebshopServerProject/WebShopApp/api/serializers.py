from django.contrib.auth.models import User, Group
from rest_framework import serializers
from WebShopApp.models import ShopItem


class ShopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = ("pk", "name", "description", "price", "username", "date")
