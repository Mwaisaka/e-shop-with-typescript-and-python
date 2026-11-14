from django.urls import path
from .views import (
    create_order, 
    list_orders, 
    get_order, 
    cancel_order, 
    list_payments, 
    initiate_payment, 
    mpesa_callback,
    advanced_analytics,
    admin_order_list,
    admin_order_detail,
    admin_update_order,
)

urlpatterns = [
    path("orders/list-orders/", list_orders),
    path("orders/create-order/", create_order),
    path("orders/get-order/<int:order_id>/", get_order),
    path("orders/<int:order_id>/cancel/", cancel_order),
    path("payments/list-payments/", list_payments),
    path("payments/create/", initiate_payment),
    path("payments/mpesa/callback/", mpesa_callback),
    path("admin/orders/advanced-analytics/", advanced_analytics),
    path("admin/orders/", admin_order_list),
    path("admin/orders/<int:order_id>/", admin_order_detail),
    path("admin/orders/<int:order_id>/update/", admin_update_order),    
]