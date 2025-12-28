from django.db import models
from categories.models import Category

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to="uploads/products/", blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if self.stock < 0:
            raise ValueError("Stock cannot be negative")
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    