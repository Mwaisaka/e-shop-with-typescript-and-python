from django.core.exceptions import ValidationError

def validate_cart_stock(cart):
    for item in cart.items.select_related("product"):
        if item.product.stock < item.quantity:
            raise ValidationError(
                f"{item.product.name} has only {item.product.stock} items left."
            )