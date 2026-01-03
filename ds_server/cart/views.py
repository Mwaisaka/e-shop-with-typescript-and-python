from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Cart, CartItem
from .serializers import CartSerializer
from products.models import Product

#Get Cart
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart,_ = Cart.objects.get_or_create(user = request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data, status =200)


#Add item to Cart
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity",1))
    
    if quantity <= 0:
        return Response({"error": "Quantity must be greater than zero"}, status = 400)
    
    product = get_object_or_404(Product, id=product_id)
    
    cart, _ = Cart.objects.get_or_create(user = request.user)
    
    item, created = Cart.objects.get_or_create(
        cart = cart,
        product = product
    )
    
    if not created:
        item.quantity +=quantity
    else:
        item.quantity = quantity
    
    item.save()
    
    return Response({"message": "Item added to cart"}, status=201)

#Update item quantity 
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    quantity = int(request.data.get("quantity",1))
    
    if quantity <=0:
        return Response({"error": "Quantiry must be greater than zero"}, status=400)
    
    item = get_object_or_404(
        CartItem,
        id = item_id,
        cart__user = request.user
    )
    
    item.quantity = quantity
    item.save()
    
    return Response({"message": "Cart item updated"}, status = 200)


#Remove item from the cart
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, item_id):
    item = get_object_or_404(
        CartItem,
        id = item_id,
        cart__user = request.user
    )
    item.delete()
    
    return Response({"message": " Item removed from the cart"}, status=200)

#Clear cart/delete all cart items
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def clear_cart(request):
    cart = get_object_or_404(Cart, user = request.data)
    cart.items.all().delete()
    
    return Response({"message": "All cart items deleted"}, status=200)
    
