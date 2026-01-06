from django.db import models
from categories.models import Category
from django.db.models import Avg

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to="uploads/products/", blank=True, null=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["category", "name"],
                name="unique_product_name_per_category"
            )
        ]
    
    def save(self, *args, **kwargs):
        if self.stock < 0:
            raise ValueError("Stock cannot be negative")
        super().save(*args, **kwargs)
    
    def average_rating(self):
        return self.reviews.aggregate(
            avg=Avg("rating")
        )["avg"] or 0

    def reviews_count(self):
        return self.reviews.count()
    
    def __str__(self):
        return self.name
    