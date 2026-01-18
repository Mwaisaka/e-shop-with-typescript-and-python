# from django.conf import settings
# from django.conf.urls.static import static
from django.urls import path
from .views import product_list_create, product_detail

urlpatterns = [
    # your other urls
    path("product-list-create/", product_list_create),
    path("product-detail/<int:product_id>/", product_detail)
]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
