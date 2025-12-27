from django.urls import path
from .views import category_list_create

urlpatterns = [
    path("categories-list-create/", category_list_create)
]