from rest_framework import serializers
from .models import Cart, CartItem
from products.models import Product

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source ="product.name")
    product_price = serializers.ReadOnlyField(source = "product.price")
    item_total = serializers.SerializerMethodField()
    
    class Meta:
        fields = [
            "id",
            "product",
            "product_name",
            "product_price",
            "quantity",
            "item_total",
            "added_at",
        ]
        read_only_fields = ["added_at"]
    
    def get_item_total(self, obj):
        return obj.get_total()
    
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only = True)
    total = serializers.SerializerMethodField()
    items_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = [
            "id",
            "user",
            "items",
            "total",
            "items_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["user", "created_at", "updated_at"]
    
    def get_total(self, obj):
        return obj.get_total()
    
    def get_items_count(self, obj):
        return obj.get_items_count()

class AddToCartSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
