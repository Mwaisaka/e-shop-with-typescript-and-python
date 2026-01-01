from django.db import models
from django.conf import settings
from products.models import Product
import uuid

User = settings.AUTH_USER_MODEL

class Order(models.Model):
    
    ORDER_STATUS = (
        ("pending","Pending"),
        ("paid","Paid"),
        ("processing","Processing"),
        ("shipped", "Shipped"),
        ("delivered","Delivered"),
        ("cancelled", "Cancelled"),
    )
    
    DELIVERY_STATUS = (
        ("not_shipped", "Not Shipped"),
        ("in_transit", "In Transit"),
        ("delivered", "Delivered"),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    order_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS, default="pending")
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS, default="not_shipped")
    shipping_address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def calculate_total(self):
        total = sum(
            item.get_total() for item in self.items.all()
        )
        self.total = total
        self.save()
        return total
    
    def __str__(self):
        return str(self.order_number)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10,decimal_places=2, editable=False)
    
    def save(self, *args, **kwargs):
        # Set price from product only when creating the item
        if not self.pk:
            self.price = self.product.price
        super().save(*args, **kwargs)
        
    def get_total(self):
        return self.quantity * self.price
    
    def __str__(self):
        return f"{self.product} x {self.quantity}"

class OrderPayment(models.Model):
    
    PAYMENT_METHODS = (
        ("mpesa", "M-Pesa"),
        ("card", "Card"),
        ("bank", "Bank Transfer"),
        ("cod", "Cash on Deliver"),
    )
    
    PAYMENT_STATUS = (
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    )
    
    order = models.ForeignKey(Order, related_name="payments", on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=200, blank=True, null=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="pending")
    paid_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.order.order_number} - {self.payment_status}"