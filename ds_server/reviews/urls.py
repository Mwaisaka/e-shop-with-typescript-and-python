from django.urls import path
from . import views

urlpatterns = [
    path("products/<int:product_id>/reviews/add_review/", views.create_review),
    path("products/<int:product_id>/reviews/", views.list_product_reviews),
    path("reviews/<int:review_id>/update_review/", views.update_review),
    path("reviews/<int:review_id>/delete_review/", views.delete_review),
]