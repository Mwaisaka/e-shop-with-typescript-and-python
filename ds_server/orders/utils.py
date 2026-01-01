from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from django.http import HttpResponse

def generate_invoice_pdf(order):
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="invoice_{order.order_number}.pdf"'

    p = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, height - 50, "INVOICE")

    p.setFont("Helvetica", 10)
    p.drawString(50, height - 80, f"Order Number: {order.order_number}")
    p.drawString(50, height - 100, f"Customer: {order.user.username}")
    p.drawString(50, height - 120, f"Total: KES {order.total}")

    y = height - 160
    for item in order.items.all():
        p.drawString(
            50, y,
            f"{item.product.name} x {item.quantity} @ {item.price}"
        )
        y -= 20

    p.showPage()
    p.save()
    return response
