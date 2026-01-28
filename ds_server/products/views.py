from .models import Product
from .serializers import ProductSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q

#View product list or create a product
@api_view(["GET","POST"])
def product_list_create(request):
    if request.method == "GET":
        q = request.GET.get("q","")
        category = request.GET.get("category")
        products = Product.objects.select_related("category").all()
        if q:
            products=products.filter(
                Q(name__icontains=q) | Q(category__name__icontains=q)
            )
        if category:
            products=products.filter(category__slug=category)
            
        serializer = ProductSerializer(
            products, 
            many=True,
            context ={"request": request}
            )
        return Response(serializer.data, status=200)
    elif request.method == "POST":
        serializer = ProductSerializer(
            data = request.data,
            context ={"request": request}
            )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

#Retrieve, Update & Delete a Single Product
@api_view(["GET", "PUT","PATCH","DELETE"])
def product_detail(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {"error": "Product not found"},
            status=404
        )
    if request.method == "GET":
        serializer = ProductSerializer(
            product,
            context ={"request": request}
            )
        return Response(serializer.data)
    elif request.method == "PUT":
        serializer = ProductSerializer(
            product, 
            data=request.data,           
            context={"request": request}
            )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == "PATCH":
        serializer = ProductSerializer(
            product, 
            data=request.data, 
            partial=True,
            context={"request": request}
            )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == "DELETE":
        product.delete()
        return Response(
            {"message": "Product deleted successfully."},
            status=200
        )