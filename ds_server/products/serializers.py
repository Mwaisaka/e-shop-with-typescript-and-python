from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    formatted_price = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "name",
            "description",
            "formatted_price",
            "stock",
            "image",
        ]
    def get_formatted_price(self, obj):
        return f"{obj.price:,.2f}"