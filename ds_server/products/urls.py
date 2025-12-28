from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import product_list_create

urlpatterns = [
    # your other urls
    path("product-list-create/", product_list_create)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
