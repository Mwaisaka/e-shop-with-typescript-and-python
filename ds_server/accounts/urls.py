from django.urls import path
from .views import login_view, register, delete_my_account, reset_password, admin_reset_password,reset_password,reset_password_confirm, admin_users_list_create, admin_user_detail, change_password
urlpatterns = [
    path("login/", login_view),
    path("register/", register),
    # path("delete-user/<int:user_id>/", admin_delete_user),
    path("delete-account/", delete_my_account),
    path("reset-my-password/", reset_password),#User already logged in
    path("admin-reset-password/<int:user_id>/", admin_reset_password),
    path("reset-password/", reset_password),
    path("reset-password-confirm/<uidb64>/<token>/", reset_password_confirm),
    path("change-password/", change_password),    
    
     # Admin user management
    path("admin/users/", admin_users_list_create),
     path("admin/users/<int:user_id>/", admin_user_detail),
]
