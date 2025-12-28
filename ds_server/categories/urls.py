from django.urls import path
from .views import category_list_create, category_detail

urlpatterns = [
    path("categories-list-create/", category_list_create),
    path("category-detail/<int:category_id>/", category_detail)
]