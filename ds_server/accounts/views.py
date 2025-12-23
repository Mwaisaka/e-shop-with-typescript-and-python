from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User

@api_view(["POST"])
def register(request):
    user = User.objects.create_user(
        username=request.data["username"],
        email=request.data["email"],
        password=request.data["password"]
    )
    return Response({"message": "User created"})
