from rest_framework import serializers
from .models import User
from apps.permissions.models import Function
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer that ensures the login field is treated as 'email'
    and adds custom claims to the JWT token.
    """
    username_field = 'email'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims for easier frontend access
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token

class FunctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Function
        fields = ['id', 'name', 'code', 'description']

class UserSerializer(serializers.ModelSerializer):
    permissions = serializers.SerializerMethodField()
    employee_details = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'permissions', 'employee_details', 'created_at', 'updated_at']

    def get_permissions(self, obj):
        return obj.functions.values_list('code', flat=True)

    def get_employee_details(self, obj):
        from apps.employees.models import Employee
        employee = Employee.objects.filter(email=obj.email).first()
        if employee:
            return {
                "phone": employee.phone,
                "department": employee.department,
                "designation": employee.designation
            }
        return None

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
