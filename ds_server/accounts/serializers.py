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
class AdminUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only= True, required=False, min_length=8)
    class Meta:
        model = User
        fields = ["id", "username","first_name","last_name", "email", "is_staff","is_superuser", "date_joined","password",]
        read_only_fields = ["id", "is_superuser", "date_joined",]
        
        def create(self, validated_data):
            password = validated_data.pop("password", None)
            
            if not password:
                raise serializers.ValidationError({"password": "Password is required."})
            
            user = User(**validated_data)
            user.set_password(password)
            user.save()
            
            return user
        
        def update(self, instance, validated_data):
            password = validated_data.pop("password", None)
            
            for field, value in validated_data.items():
                setattr(instance, field, value)
            
            if password:
                instance.set_password(password)
            
            instance.save()
            return instance