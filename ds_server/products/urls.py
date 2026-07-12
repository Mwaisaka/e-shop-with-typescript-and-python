# from django.conf import settings
# from django.conf.urls.static import static
from django.urls import path
from .views import product_list_create, product_detail, related_products, grouped_products

urlpatterns = [
    # your other urls
    path("", product_list_create),
    path("product-detail/<int:product_id>/", product_detail),
    path("<int:product_id>/related/", related_products),
    path("grouped_products/", grouped_products)    
    
]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
