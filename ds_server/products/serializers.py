from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    image = serializers.SerializerMethodField()
    formatted_price = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "name",
            "description",
            "price",
            "formatted_price",
            "stock",
            "image",
        ]
    def validate(self, data):
        category = data.get("category")
        name = data.get("name")

        if Product.objects.filter(category=category, name__iexact=name).exists():
            raise serializers.ValidationError(
                {"name": "Product with this name already exists in this category."}
            )
        return data
    
    def get_formatted_price(self, obj):
        return f"{obj.price:,.2f}"
    
    def get_average_rating(self, obj):
        return round(obj.average_rating(), 1)

    def get_reviews_count(self, obj):
        return obj.reviews_count()
    
    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None