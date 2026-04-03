from django.db import models
from products.models import Product
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Cart(models.Model):
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE, related_name="cart")
    session_key = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Get total cost of items in the cart
    def get_total(self):
        return sum(item.get_total() for item in self.items.all())

    # Get total number of items in the cart
    def get_items_count(self):
        return sum(item.quantity for item in self.items.all())

    def __str__(self):
        if self.user:
            return f"Cart ({self.user})"
        return f"Guest Cart ({self.session_key})"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("cart", "product")
        ordering = ["-added_at"]

    def get_total(self):
        return self.quantity * self.product.price

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
