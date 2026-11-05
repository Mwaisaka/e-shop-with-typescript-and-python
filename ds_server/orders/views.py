from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils.timezone import now
from .models import OrderPayment, Order, OrderItem
from rest_framework.permissions import IsAuthenticated
from .utils import generate_invoice_pdf
from .serializers import OrderSerializer, OrderItemSerializer, OrderPaymentSerializer, OrderCreateSerializer

from datetime import timedelta
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.db.models import (
    Avg,
    Count,
    DecimalField,
    Exists,
    F,
    OuterRef,
    Q,
    Sum,
    Value,
)
from django.db.models.functions import (
    Coalesce,
    TruncDate,
    TruncMonth,
)
from django.utils import timezone
from rest_framework.permissions import IsAdminUser
from products.models import Product

User = get_user_model()

#Create Order Serializer (Checkout)
@api_view(["POST"])
# @permission_classes([IsAuthenticated])
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

    serializer = OrderSerializer(orders, many=True, context={"request": request} )
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
    serialier = OrderSerializer(order, context={"request": request})
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

# Adjust this threshold to suit your store.
LOW_STOCK_THRESHOLD = 5

MONEY_FIELD = DecimalField(
    max_digits=14,
    decimal_places=2,
)

ZERO_MONEY = Value(
    Decimal("0.00"),
    output_field=MONEY_FIELD,
)

def money_value(value):
    """Convert Decimal or None into a JSON-friendly number."""
    return float(value or Decimal("0.00"))

def percentage_change(current, previous):
    """Calculate percentage change against the previous period."""
    if previous == 0:
        return 100.0 if current > 0 else 0.0

    return round(
        ((current - previous) / previous) * 100,
        2,
    )

def metric(current, previous):
    return {
        "value": money_value(current),
        "change_percent": percentage_change(
            current,
            previous,
        ),
    }
    
def get_paid_payments(start, end):
    """
    Return successful payments within a date range.

    paid_at is preferred. created_at is used as a fallback
    for paid records where paid_at was not populated.
    """
    return (
        OrderPayment.objects
        .filter(payment_status="paid")
        .annotate(
            paid_date=Coalesce(
                "paid_at",
                "created_at",
            )
        )
        .filter(
            paid_date__gte=start,
            paid_date__lt=end,
        )
    )

def get_period_metrics(start, end):
    """Calculate the main metrics for a date range."""

    payments = get_paid_payments(start, end)

    revenue = payments.aggregate(
        total=Coalesce(
            Sum("amount"),
            ZERO_MONEY,
            output_field=MONEY_FIELD,
        )
    )["total"]

    paid_order_ids = (
        payments.values("order_id").distinct()
    )

    paid_order_count = Order.objects.filter(
        pk__in=paid_order_ids
    ).count()

    orders = Order.objects.filter(
        created_at__gte=start,
        created_at__lt=end,
    )

    total_orders = orders.count()

    customer_ids = list(
        orders.values_list("user_id", flat=True).distinct()
    )

    customer_count = len(customer_ids)

    customer_order_counts = (
        orders.values("user_id")
        .annotate(order_count=Count("id"))
    )

    repeat_customers = customer_order_counts.filter(
        order_count__gt=1
    ).count()

    repeat_rate = (
        repeat_customers / customer_count * 100
        if customer_count else 0
    )

    average_order_value = (
        revenue / paid_order_count
        if paid_order_count else Decimal("0.00")
    )

    return {
        "revenue": revenue,
        "orders": total_orders,
        "customers": customer_count,
        "average_order_value": average_order_value,
        "repeat_customer_rate": repeat_rate,
        "paid_order_count": paid_order_count,
    }

def get_date_range(period):
    """Return the selected date range and previous comparison range."""

    now = timezone.now()

    durations = {
        "7d": timedelta(days=7),
        "30d": timedelta(days=30),
        "90d": timedelta(days=90),
        "12m": timedelta(days=365),
    }

    duration = durations.get(period)

    if duration is None:
        period = "30d"
        duration = durations[period]

    end = now
    start = end - duration

    previous_end = start
    previous_start = previous_end - duration

    return (
        period,
        start,
        end,
        previous_start,
        previous_end,
    )

def get_revenue_trend(start, end, period):
    """Group paid revenue and paid orders by day or month."""

    payments = get_paid_payments(start, end)

    if period == "12m":
        bucket = TruncMonth(
            "paid_date",
            tzinfo=timezone.get_current_timezone(),
        )
        label_format = "%b %Y"
    else:
        bucket = TruncDate(
            "paid_date",
            tzinfo=timezone.get_current_timezone(),
        )
        label_format = "%d %b"

    rows = (
        payments
        .annotate(bucket=bucket)
        .values("bucket")
        .annotate(
            revenue=Sum("amount"),
            orders=Count("order_id", distinct=True),
        )
        .order_by("bucket")
    )

    return [
        {
            "label": row["bucket"].strftime(label_format),
            "revenue": money_value(row["revenue"]),
            "orders": row["orders"],
        }
        for row in rows
    ]


def get_category_performance(start, end):
    """
    Calculate units and order-item sales value by category.

    Only items belonging to orders with at least one paid
    payment are included. This is item sales value, not
    allocated payment revenue.
    """

    paid_orders = Order.objects.filter(
        pk=OuterRef("order_id"),
        payments__payment_status="paid",
    )

    items = (
        OrderItem.objects
        .filter(
            order__created_at__gte=start,
            order__created_at__lt=end,
        )
        .annotate(is_paid=Exists(paid_orders))
        .filter(is_paid=True)
    )

    rows = (
        items.values("product__category__name")
        .annotate(
            revenue=Sum(
                F("quantity") * F("price"),
                output_field=MONEY_FIELD,
            ),
            units_sold=Sum("quantity"),
        )
        .order_by("-revenue")[:10]
    )

    return [
        {
            "name": row["product__category__name"],
            "revenue": money_value(row["revenue"]),
            "units_sold": row["units_sold"],
        }
        for row in rows
    ]


def get_top_products(start, end):
    paid_orders = Order.objects.filter(
        pk=OuterRef("order_id"),
        payments__payment_status="paid",
    )

    items = (
        OrderItem.objects
        .filter(
            order__created_at__gte=start,
            order__created_at__lt=end,
        )
        .annotate(is_paid=Exists(paid_orders))
        .filter(is_paid=True)
    )

    rows = (
        items.values("product_id", "product__name")
        .annotate(
            units_sold=Sum("quantity"),
            revenue=Sum(
                F("quantity") * F("price"),
                output_field=MONEY_FIELD,
            ),
        )
        .order_by("-units_sold")[:10]
    )

    return [
        {
            "id": row["product_id"],
            "name": row["product__name"],
            "units_sold": row["units_sold"],
            "revenue": money_value(row["revenue"]),
        }
        for row in rows
    ]


def get_order_statuses(start, end):
    rows = (
        Order.objects
        .filter(
            created_at__gte=start,
            created_at__lt=end,
        )
        .values("order_status")
        .annotate(count=Count("id"))
        .order_by("-count")
    )

    return [
        {
            "status": row["order_status"],
            "count": row["count"],
        }
        for row in rows
    ]


def get_payment_methods(start, end):
    rows = (
        get_paid_payments(start, end)
        .values("payment_method")
        .annotate(
            count=Count("id"),
            amount=Sum("amount"),
        )
        .order_by("-amount")
    )

    return [
        {
            "method": row["payment_method"],
            "count": row["count"],
            "amount": money_value(row["amount"]),
        }
        for row in rows
    ]


def get_low_stock_products():
    products = (
        Product.objects
        .filter(stock__lte=LOW_STOCK_THRESHOLD)
        .order_by("stock", "name")[:10]
    )

    return [
        {
            "id": product.id,
            "name": product.name,
            "stock": product.stock,
        }
        for product in products
    ]


def get_recent_orders():
    orders = (
        Order.objects
        .select_related("user")
        .order_by("-created_at")[:10]
    )

    return [
        {
            "order_number": str(order.order_number),
            "customer_name": (
                order.user.get_full_name()
                or order.user.username
            ),
            "total_amount": money_value(order.total),
            "status": order.order_status,
            "created_at": order.created_at.isoformat(),
        }
        for order in orders
    ]


def get_business_insights(current, previous, low_stock_count):
    insights = []

    revenue_change = percentage_change(
        float(current["revenue"]),
        float(previous["revenue"]),
    )

    if revenue_change > 0:
        insights.append({
            "title": "Revenue is growing",
            "description": (
                f"Revenue increased by {revenue_change}% "
                "compared with the previous period."
            ),
            "severity": "success",
        })
    elif revenue_change < 0:
        insights.append({
            "title": "Revenue has declined",
            "description": (
                f"Revenue decreased by {abs(revenue_change)}% "
                "compared with the previous period."
            ),
            "severity": "warning",
        })
    else:
        insights.append({
            "title": "Revenue is unchanged",
            "description": (
                "Revenue is at the same level as the previous period."
            ),
            "severity": "info",
        })

    if low_stock_count:
        insights.append({
            "title": "Inventory needs attention",
            "description": (
                f"{low_stock_count} products have stock at or "
                f"below {LOW_STOCK_THRESHOLD} units."
            ),
            "severity": "warning",
        })

    if current["repeat_customer_rate"] > 30:
        insights.append({
            "title": "Customer retention",
            "description": (
                "More than 30% of purchasing customers placed "
                "multiple orders during this period."
            ),
            "severity": "success",
        })

    if current["orders"] == 0:
        insights.append({
            "title": "No orders recorded",
            "description": (
                "No orders were created during the selected period."
            ),
            "severity": "info",
        })

    return insights


@api_view(["GET"])
@permission_classes([IsAdminUser])
def advanced_analytics(request):

    (
        period,
        start,
        end,
        previous_start,
        previous_end,
    ) = get_date_range(request.query_params.get("period", "30d"))

    current = get_period_metrics(start, end)
    previous = get_period_metrics(previous_start, previous_end)

    low_stock_products = get_low_stock_products()

    # Use the total count, not just the ten displayed products.
    low_stock_count = Product.objects.filter(
        stock__lte=LOW_STOCK_THRESHOLD
    ).count()

    # Conversion rate cannot be calculated without visit tracking.
    conversion_rate = None

    # Profit cannot be calculated without product cost and expenses.
    estimated_profit = None

    response_data = {
        "period": period,

        "revenue": metric(
            current["revenue"],
            previous["revenue"],
        ),

        "orders": metric(
            current["orders"],
            previous["orders"],
        ),

        "average_order_value": metric(
            current["average_order_value"],
            previous["average_order_value"],
        ),

        "customers": metric(
            current["customers"],
            previous["customers"],
        ),

        "repeat_customer_rate": {
            "value": round(
                current["repeat_customer_rate"], 2
            ),
            "change_percent": percentage_change(
                current["repeat_customer_rate"],
                previous["repeat_customer_rate"],
            ),
        },

        "conversion_rate": conversion_rate,
        "estimated_profit": estimated_profit,

        "low_stock_count": low_stock_count,

        "revenue_trend": get_revenue_trend(
            start,
            end,
            period,
        ),

        "category_performance": get_category_performance(
            start,
            end,
        ),

        "orders_by_status": get_order_statuses(
            start,
            end,
        ),

        "payment_methods": get_payment_methods(
            start,
            end,
        ),

        "top_products": get_top_products(
            start,
            end,
        ),

        "low_stock_products": low_stock_products,

        "recent_orders": get_recent_orders(),

        "funnel": {
            "visits": None,
            "orders": current["orders"],
        },

        "insights": get_business_insights(
            current,
            previous,
            low_stock_count,
        ),
    }
    return Response(response_data)