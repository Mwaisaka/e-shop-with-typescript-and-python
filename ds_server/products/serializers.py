from rest_framework import serializers
from .models import Product
from categories.models import Category


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )
    image = serializers.SerializerMethodField()
    formatted_price = serializers.SerializerMethodField(read_only=True)
    avg_rating = serializers.FloatField(read_only=True)
    review_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "category_id",
            "name",
            "description",
            "price",
            "formatted_price",
            "stock",
            "image",
            "avg_rating",
            "review_count",
        ]

    def validate(self, data):
        category = data.get(
            "category",
            self.instance.category if self.instance else None
            )
        name = data.get(
            "name",
            self.instance.name if self.instance else None
            )

        # if Product.objects.filter(category=category, name__iexact=name).exists():
        #     raise serializers.ValidationError(
        #         {"name": "Product with this name already exists in this category."}
        #     )
        # return data
        if category and name:
            duplicate = Product.objects.filter(
                category=category,
                name__iexact=name
            )

            if self.instance:
                duplicate = duplicate.exclude(pk=self.instance.pk)

            if duplicate.exists():
                raise serializers.ValidationError({
                    "name": "Product with this name already exists in this category."
                })

        return data

    def get_formatted_price(self, obj):
        return f"{obj.price:,.2f}"

    def get_avg_rating(self, obj):
        return round(obj.avg_rating(), 1)

    def get_review_count(self, obj):
        return obj.review_count()

    def get_image(self, obj):
        if obj.image:
            return obj.image.build_url(
                quality="auto",
                fetch_format="auto"
            )
        return None
