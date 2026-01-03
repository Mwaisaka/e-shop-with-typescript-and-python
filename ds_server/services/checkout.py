from django.db import transaction
from django.core.exceptions import ValidationError
from orders.models import Order, OrderItem
from cart.models import Cart
from utils.stock import validate_cart_stock

validate_cart_stock(cart)

@transaction.atomic
def checkout_cart(user, shipping_address):
    """
    Converts user's cart into an order
    """
    
    cart = Cart.objects.select_related("user").prefetch_related("items_product")
    
    if not cart.items.exists():
        raise ValidationError("Cart is empty")
    
    #Stock validation
    for item in cart.items.all():
        if item.product.stock<item.quantity:
            raise ValidationError("f'Insufficient stock for {item.product.name}")
    
    #Create order
    order = Order.objects.create(
        user = user,
        shipping_address = shipping_address
    )
    
    total = 0
    
    #Create order items + reduce stock
    for item in cart.items.all():
        OrderItem.objects.create(
            order = order,
            product = item.product,
            quantity = item.quantity,
        )
     
        #Reduce stock 
        item.product.stock -= item.quantity
        item.product.save()
        
    #Update order total 
    order.total = total
    order.save()
    
    #Clear cart
    cart.items.all().delete()
    
    return order 


     
    
    