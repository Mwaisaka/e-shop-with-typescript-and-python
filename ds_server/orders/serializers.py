from rest_framework import serializers
from .models import Order, OrderItem, OrderPayment
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    product_description = serializers.ReadOnlyField(source="product.description")
    total = serializers.SerializerMethodField()
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_description",
            "product_image",
            "quantity",
            "price",
            "total",
        ]

        read_only_fields = ["price"]

    def get_total(self, obj):
        return obj.get_total()

    def get_product_image(self, obj):
        image = obj.product.image

        if not image:
            return None

        try:
            return image.url  # Just return Cloudinary URL directly
        except Exception:
            return None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    order_number = serializers.ReadOnlyField()
    order_status = serializers.ReadOnlyField()
    delivery_status = serializers.ReadOnlyField()

    class Meta:
        model = Order
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

    # def create(self, validated_data):
    #     user = self.context["request"].user
    #     return Order.objects.create(user=user, **validated_data)


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
            user=user, shipping_address=validated_data["shipping_address"]
        )

        for item in items_data:
            OrderItem.objects.create(
                order=order, product=item["product"], quantity=item["quantity"]
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

class AdminOrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_image = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "quantity",
            "price",
            "subtotal",
        ]

    def get_product_image(self, obj):
        if obj.product.image:
            try:
                return object.product.image.build_ulr(
                    quality="auto", fetch_format="auto"
                )
            except Exception:
                return None
        return None

    def get_subtotal(self, obj):
        return obj.get_total()

class AdminOrderPaymentSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderPayment
        fields = [
            "id",
            "payment_method",
            "amount",
            "transaction_id",
            "payment_status",
            "paid_at",
            "created_at",
        ]

class AdminOrderSerializer(serializers.ModelSerializer):
    items = AdminOrderItemSerializer(many=True, read_only=True)
    payments = AdminOrderPaymentSerializer(many=True, read_only=True)
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "user",
            "customer_name",
            "customer_email",
            "shipping_address",
            "items",
            "total",
            "order_status",
            "delivery_status",
            "payments",
            "created_at",
            "updated_at",
        ]

    def get_customer_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

class AdminOrderUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = ["order_status", "delivery_status"]

    def validate(self, attrs):
        order_status = attrs.get("order_status", self.instance.oder_status)
        delivery_status = attrs.get("delivery_status", self.instance.delivery_status)

        if order_status == "delivered" and delivery_status != "delivered":
            raise serializers.validationError(
                {
                    "delivery status": (
                        "A delivered order must have delivery status delivered."
                    )
                }
            )

        if delivery_status == "delivered" and order_status not in ["delivered"]:
            raise serializers.ValidationError(
                {
                    "order_status": (
                        "Set the order status to delivered when delivery "
                        "status is delivered."
                    )
                }
            )

        if order_status == "cancelled" and delivery_status == "delivered":
            raise serializers.ValidationError(
                {
                    "delivery_status": (
                        "A cancelled order cannot have delivered delivery status."
                    )
                }
            )
        
        return attrs
