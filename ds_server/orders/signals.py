from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import OrderItem, OrderPayment
from django.utils.timezone import now 

#Recalculate total after save
@receiver(post_save, sender=OrderItem)
def update_order_total_on_save(sender, instance, **kwargs):
    instance.order.calculate_total()
    
#Recalculate total after delete
@receiver(post_delete, sender=OrderItem)
def update_order_total_on_delete(sender, instance, **kwargs):
    instance.order.calculate_total()

#Reduce stock when payment is successful
@receiver(post_save, sender=OrderPayment)
def reduce_stock_on_payment(sender, instance,created, **kwargs):
    if instance.status == "paid":
        order = instance.order
        
        #Avoid double stock deduction
        if order.order_status != "paid":
            for item in order.items.all():
                product = item.product
                product.stock -= item.quantity
                product.save()
            order.order_status = "paid"
            order.updated_at = now()
            order.save()