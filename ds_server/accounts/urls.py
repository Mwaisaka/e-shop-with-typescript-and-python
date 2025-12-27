from django.urls import path
from .views import register, admin_delete_user, delete_my_account, reset_password, admin_reset_password,forgot_password,reset_password_confirm, get_all_users

urlpatterns = [
    path("register/", register),
    path("delete-user/<int:user_id>/", admin_delete_user),
    path("delete-account/", delete_my_account),
    path("reset-my-password/", reset_password),
    path("admin-reset-password/<int:user_id>/", admin_reset_password),
    path("forgot-password/", forgot_password),
    path("reset-password-confirm/<uidb64>/<token>/", reset_password_confirm),
    path("list-all-users/", get_all_users),
]
