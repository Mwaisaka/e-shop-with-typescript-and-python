from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    class Meta:
        model = User
        fields = ["id", "username","first_name","last_name", "email", "is_active", "date_joined","last_login",]
        extra_kwargs = {
            "password": {"write_only": True}
        }
        
        def create(self, validated_data):
            user = User.objects.create_user(**validated_data)
            return user
        
        def validate_email(self, value):
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Email already exists.")
            return value