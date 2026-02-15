from .models import Product
from .serializers import ProductSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Avg, Count
from rest_framework.permissions import AllowAny


# View product list or create a product
@permission_classes([AllowAny])
@api_view(["GET", "POST"])
def product_list_create(request):
    if request.method == "GET":
        q = request.GET.get("q", "")
        category = request.GET.get("category")
        min_price = request.GET.get("min_price")
        max_price = request.GET.get("max_price")
        rating = request.GET.get("rating")

        # products = Product.objects.select_related("category").all()

        products = Product.objects.select_related("category").annotate(
            avg_rating=Avg("reviews__rating"),
            review_count=Count("reviews")
        )

        # Search product by name or category
        if q:
            products = products.filter(
                Q(name__icontains=q) | Q(category__name__icontains=q)
            )

        # Filter category slug
        if category:
            products = products.filter(category__slug=category)

        # Filter by price
        if min_price:
            products = products.filter(price__gte=min_price)

        if max_price:
            products = products.filter(price__lte=max_price)

        # Filter by rating
        if rating:
            products = products.filter(avg_rating__gte=rating)

        serializer = ProductSerializer(
            products, many=True, context={"request": request}
        )
        return Response(serializer.data, status=200)
    elif request.method == "POST":
        serializer = ProductSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# Retrieve, Update & Delete a Single Product
@api_view(["GET", "PUT", "PATCH", "DELETE"])
def product_detail(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
    if request.method == "GET":
        serializer = ProductSerializer(product, context={"request": request})
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = ProductSerializer(
            product, data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == "PATCH":
        serializer = ProductSerializer(
            product, data=request.data, partial=True, context={"request": request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == "DELETE":
        product.delete()
        return Response({"message": "Product deleted successfully."}, status=200)
