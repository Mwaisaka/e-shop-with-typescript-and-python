from rest_framework import serializers
from .models import Order, OrderItem, OrderPayment
from products.models import Product

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    total = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "price",
            "total",
        ]
        
        read_only_fields = ["price"]
        
        def get_total(self,obj):
            return obj.get_total()
        
class OrderSerializer(serializers.ModelSerializer):
    item = OrderItemSerializer(many=True, read_only = True)
    total = serializers.ReadOnlyField()
    order_number = serializers.ReadOnlyField()
    order_status = serializers.ReadOnlyField()
    delivery_status = serializers.ReadOnlyField()
    
    class Meta:
        fields = [
            "id",
            "order_number",
            "user",
            "shipping_address",
            "items",
            "total",
            "order_status",
            "delivery_status",
            "created_at",
        ]
        
        read_only_fields = [
            "user",
            "order_number",
            "total",
            "order_status",
            "delivery_status",
            "created_at",
        ]
        
        def create(self, validated_data):
            user = self.context["request"].user
            return Order.objects.create(user=user, **validated_data)
        
class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product", "quantity"]

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = ["shipping_address", "items"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user

        order = Order.objects.create(
            user=user,
            shipping_address=validated_data["shipping_address"]
        )

        for item in items_data:
            OrderItem.objects.create(
                order=order,
                product=item["product"],
                quantity=item["quantity"]
            )

        order.calculate_total()
        return order

class OrderPaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.ReadOnlyField(source="order.order_number")

    class Meta:
        model = OrderPayment
        fields = [
            "id",
            "order",
            "order_number",
            "payment_method",
            "amount",
            "transaction_id",
            "payment_status",
            "paid_at",
            "created_at",
        ]
        read_only_fields = [
            "amount",
            "payment_status",
            "paid_at",
            "transaction_id",
            "created_at",
        ]
