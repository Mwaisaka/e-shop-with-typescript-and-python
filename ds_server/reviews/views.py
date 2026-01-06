from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .serializers import ReviewSerializer
from .models import Review
from products.models import Product

#Create a review
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_review(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    if Review.objects.filter(product=product, user=request.user).exists():
        return Response(
            {"error": "You have already reviewed this product"},
            status = 400
        )
    serializer = ReviewSerializer(data=request.data, context = {"request": request})
    
    if serializer.is_valid():
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

#List reviews for a product
@api_view(["GET"])
def list_product_reviews(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    reviews = product.reviews.all()
    serializer = ReviewSerializer(reviews, many=True)
    
    return Response(serializer.data, status = 200)

#Update review (owner only)
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_review(request, review_id):
    review = get_object_or_404(Review, id=review_id, user = request.user)
    
    serializer = ReviewSerializer(
        review,
        data = request.data,
        partial = True,
        context = {"request": request}
    )
    
    if serializer.is_valid():
        return Response(serializer.data, status = 200)
    return Response(serializer.errors, status=400)

#Delete Review (Owner only)
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_review(request, review_id):
    review = get_object_or_404(
        Review,
        id = review_id,
        user = request.user
    )
    review.delete()
    return Response(
        {"message":"Review deleted"},
        status=200
    )