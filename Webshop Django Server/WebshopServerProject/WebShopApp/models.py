from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class ShopItem(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=1000)
    price = models.DecimalField(max_digits=9, decimal_places=2)
    username = models.CharField(max_length=50, default="default user")
    date = models.DateTimeField(auto_now_add=True)
    sold = models.BooleanField(default=False)
    version = models.IntegerField(default=0)
    purchased_by = models.CharField(max_length=50, default="default user")
