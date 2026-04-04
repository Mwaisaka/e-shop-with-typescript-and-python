from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .utils import get_or_create_cart

from .models import Cart, CartItem
from .serializers import CartSerializer
from products.models import Product

#Get Cart
@api_view(["GET"])
def get_cart(request):
    cart = get_or_create_cart(request)
    print("Session Key:", request.session.session_key)
    print("Cart ID:", cart.id)
    print("Cart Items:", cart.items.count())
    serializer = CartSerializer(cart, context={"request": request})
    print(serializer.data)
    return Response(serializer.data, status =200)

#Add item to Cart
@api_view(["POST"])
def add_to_cart(request):
    product_id = request.data.get("product_id")
    quantity = int(request.data.get("quantity",1))
    
    if not product_id:
        return Response({"error": "Product ID is required"}, status=400)
    
    if quantity <= 0:
        return Response({"error": "Quantity must be greater than zero"}, status = 400)
    
    product = get_object_or_404(Product, id=product_id)
       
    # Use user if logged in, else session_key
    cart = get_or_create_cart(request)
            
    item, created = CartItem.objects.get_or_create(
        cart = cart,
        product = product
    )
    
    if not created:
        item.quantity +=quantity
    else:
        item.quantity = quantity
    
    item.save()
    
    # return Response({"message": "Item added to cart"}, status=201)
    # Return updated cart
    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data, status=201)

#Update item quantity 
@api_view(["PUT"])
def update_cart_item(request, item_id):
    quantity = int(request.data.get("quantity",1))
    
    if quantity <=0:
        return Response({"error": "Quantiry must be greater than zero"}, status=400)
    
    cart = get_or_create_cart(request)
    
    item = get_object_or_404(
        CartItem,
        id = item_id,
        cart=cart
    )
    
    item.quantity = quantity
    item.save()
    
    # return Response({"message": "Cart item updated"}, status = 200)

    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data, status=200)

#Remove item from the cart
@api_view(["DELETE"])
def remove_cart_item(request, item_id):
    cart = get_or_create_cart(request)
     
    item = get_object_or_404(
        CartItem,
        id = item_id,
        cart=cart
    )
    item.delete()
    
    # return Response({"message": " Item removed from the cart"}, status=200)
    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data, status=200)

#Clear cart/delete all cart items
@api_view(["DELETE"])
def clear_cart(request):
    cart = get_or_create_cart(request)        
    cart.items.all().delete()
    
    # return Response({"message": "All cart items deleted"}, status=200)
    serializer = CartSerializer(cart, context={"request": request})
    return Response(serializer.data, status=200)
    
