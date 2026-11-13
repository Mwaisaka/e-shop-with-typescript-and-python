from django.urls import path
from .views import (
    product_list_create,
    product_detail,
    related_products,
    grouped_products,
)

urlpatterns = [
    # your other urls
    path("products-list-create/", product_list_create),
    path("product-detail/<int:product_id>/", product_detail),
    path("<int:product_id>/related/", related_products),
    path("grouped-products/", grouped_products),
]
