from django.urls import path
from .views import (
    create_order, 
    list_orders, 
    get_order, 
    cancel_order, 
    list_payments, 
    initiate_payment, 
    mpesa_callback
)

urlpatterns = [
    path("orders/list-orders/", list_orders),
    path("orders/create-order/", create_order),
    path("orders/get-order/<int:order_id>/", get_order),
    path("orders/<int:order_id>/cancel/", cancel_order),
    path("payments/list-payments/", list_payments),
    path("payments/create/", initiate_payment),
    path("payments/mpesa/callback/", mpesa_callback),
]