from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils.timezone import now
from .models import OrderPayment, Order, OrderItem
from rest_framework.permissions import IsAuthenticated
from .utils import generate_invoice_pdf
from .serializers import OrderSerializer, OrderItemSerializer, OrderPaymentSerializer, OrderCreateSerializer

#Create Order Serializer (Checkout)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_order(request):
    serializer = OrderCreateSerializer(data=request.data, context = {"request":request})
    
    if serializer.is_valid():
        order = serializer.save()
        return Response(
            OrderSerializer(order).data,
            status=201
        )
    return Response(serializer.errors, status = 400)

#List orders
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_orders(request):
    orders = Order.objects.filter(user=request.user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data, status = 200)

#Retrieve a single Order
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_order(request, order_id):
    try:
        order = Order.objects.get(id = order_id, user =request.user)
    except Order.DoesNotExist:
        return Response(
            {"detail": "Order not found"},
            status = 404
        )
    serialier = OrderSerializer(order)
    return Response(serialier.data, status = 200)    

#Cancel Order
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    try:
        order = Order.objects.get(id = order_id, user =request.user)
    except Order.DoesNotExist:
        return Response(
            {"detail": "Order not found"},
            status = 404
        )
    if order.order_status in ["shipped","delivered"]:
        return Response(
            {"detail": "Cannot cancel shipped or delivered order"},
            status = 400
        )
    order.order_status = "cancelled"
    order.save()
    return Response({"detail":"Order cancelled successfully"}, status =200)

#Initiate Payment 
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    order_id = request.data.get("order")
    try:
        order = Order.objects.get(id=order_id, user = request.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status = 404)
    
    payment = OrderPayment.objects.create(
        order = order,
        payment_method = request.data.get("payment_method"),
        amount = order.total
    )
    serializer = OrderPaymentSerializer(payment)
    return Response (serializer.data, status = 201)

#List Payments for a user
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_payments(request):
    payments = OrderPayment.objects.filter(order_user = request.user)
    serializer = OrderPaymentSerializer(payments, many=True)
    return Response(serializer.data, status = 200)

@api_view(["POST"])
def mpesa_callback(request):
    data = request.data

    result_code = data.get("Body", {}).get("stkCallback", {}).get("ResultCode")
    checkout_id = data.get("Body", {}).get("stkCallback", {}).get("CheckoutRequestID")

    if result_code == 0:
        try:
            payment = OrderPayment.objects.get(transaction_id=checkout_id)
            payment.payment_status = "paid"
            payment.paid_at = now()
            payment.save()
        except OrderPayment.DoesNotExist:
            return Response({"detail": "Payment not found"}, status=404)

        return Response({"detail": "Payment successful"}, status = 200)

    return Response({"detail": "Payment failed"}, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def download_invoice(request, order_id):
    order = Order.objects.get(id=order_id, user=request.user)
    return generate_invoice_pdf(order)
