from django.urls import path
from .views import get_cart,add_to_cart,update_cart_item,clear_cart,remove_cart_item

urlpatterns = [
    path("cart-items/", get_cart),
    path("add-to-cart/", add_to_cart),
    path("update-cart-item/<int:item_id>/", update_cart_item),
    path("remove-cart-item/<int:item_id>/", remove_cart_item),
    path("clear-cart/", clear_cart),
]