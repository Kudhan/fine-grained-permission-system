from rest_framework import serializers
from .models import User
from apps.permissions.models import Function

class FunctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Function
        fields = ['id', 'name', 'code', 'description']

class UserSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'permissions', 'created_at', 'updated_at']

    def get_permissions(self, obj):
        return obj.functions.values_list('code', flat=True)
