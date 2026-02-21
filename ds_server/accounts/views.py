from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
import json
from django.contrib.auth import authenticate, login

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .serializers import UserSerializer


@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = authenticate(
            username=data.get("username"),
            password=data.get("password"),
        )

        if user:
            login(request, user)
            return JsonResponse({"message": "Login successful"})
        return JsonResponse({"error": "Invalid credentials"}, status=400)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=200)


@api_view(["POST"])
def register(request):
    user = User.objects.create_user(
        username=request.data["username"],
        first_name=request.data["first_name"],
        last_name=request.data["last_name"],
        email=request.data["email"],
        password=request.data["password"],
    )
    return Response({"message": "User created"})


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def admin_delete_user(request, user_id):
    try:
        User.objects.get(id=user_id).delete()
        return Response({"message": "User deleted successfully"}, status=200)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_my_account(request):
    user = request.user
    user.delete()
    return Response({"message": "Your account has been deleted"}, status=200)


# Password reset by user
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reset_password(request):
    """
    Reset the password of the currently logged-in user.
    Body should contain:
    - old_password
    - new_password
    - confirm_new_password
    """
    user = request.user
    data = request.data

    old_password = data.get("old_password")
    new_password = data.get("new_password")
    confirm_new_password = data.get("confirm_new_password")

    if not old_password or not new_password:
        return Response(
            {"error": "Both old password and new password are required."}, status=400
        )

    # check if old password is correct
    if not user.check_password(old_password):
        return Response({"error:" "Old password is incorrect."}, status=400)
    # Check in new_password matches confirm_new_password
    if new_password == confirm_new_password:
        return Response(
            {"error": "Confirm_new_password does not match with new_password"},
            status=400,
        )
    # Set new password
    user.set_password(new_password)
    user.save()

    return Response({"message": "Password updated successfully."}, status=200)


# Password reset by admin
@api_view(["POST"])
# @permission_classes([IsAdminUser])
def admin_reset_password(request, user_id):
    """
    Admin can reset any user's password.
        Body should contain:
        - new_password
    """

    data = request.data
    new_password = data.get("new_password")

    if not new_password:
        return Response({"error": "New passowrd is required."}, status=400)

    try:
        user = User.objects.get(id=user_id)
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password reset was successful."}, status=200)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)


# Reset password via forgot email
@api_view(["POST"])
def forgot_password(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email is required."}, status=400)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Prevent email enumeration
        return Response(
            {"message": "If an account exists, a reset email has been sent."},
            status=200,
        )
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = PasswordResetTokenGenerator().make_token(user)

    reset_link = f"http://localhost:3000/forgot-password/{uid}/{token}/"

    send_mail(
        subject="Password Reset Request",
        message=f"Click the link to reset your password:\n{reset_link}",
        from_email=None,
        recipient_list=[user.email],
    )

    return Response({"message": "Password reset link sent to your email"}, status=200)


# Reset password using token
@api_view(["POST"])
def reset_password_confirm(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_encode(uidb64))
        user = User.objects.get(pk=uid)

    except (User.DoesNotExist, ValueError, TypeError):
        return Response({"error": "Invalid reset link"}, status=400)

    if not PasswordResetTokenGenerator().check_token(user, token):
        return Response({"error": "Invalid or expired token"}, status=400)

    new_password = request.data.get("new_password")

    if not new_password:
        return Response({"error": "New password is required."}, status=400)
    try:
        validate_password(new_password, user)
    except ValidationError as e:
        return Response({"error": e.messages}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password reset sucessful"}, status=200)
