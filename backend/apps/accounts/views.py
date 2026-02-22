from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import UserSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.core.utils import api_response
from apps.permissions.permissions import HasPermission
from .models import User

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /auth/login/
    Custom login view that accepts email instead of username.
    """
    serializer_class = CustomTokenObtainPairSerializer

class MeView(generics.RetrieveUpdateAPIView):
    """
    GET /auth/me/ - Returns current user profile
    PATCH /auth/me/ - Updates current user profile
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return api_response(data=serializer.data, message="Profile retrieved successfully")

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Ensure employee record exists and is updated
            from apps.employees.models import Employee
            from django.utils import timezone
            
            employee, created = Employee.objects.get_or_create(
                email=user.email,
                defaults={
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'department': request.data.get('department', 'Unassigned'),
                    'designation': request.data.get('designation', 'Staff'),
                    'date_joined': timezone.now().date(),
                    'phone': request.data.get('phone', '')
                }
            )
            
            if not created:
                employee.first_name = request.data.get('first_name', employee.first_name)
                employee.last_name = request.data.get('last_name', employee.last_name)
                employee.phone = request.data.get('phone', employee.phone)
                employee.department = request.data.get('department', employee.department)
                employee.designation = request.data.get('designation', employee.designation)
                employee.save()
            
            # Re-serialize to get fresh data including employee_details
            fresh_data = self.get_serializer(user).data
            return api_response(data=fresh_data, message="Profile updated successfully")
        return api_response(message="Update failed", errors=serializer.errors, status_code=400)

class UserListView(generics.ListAPIView):
    """
    GET /auth/users/ (Wait, I'll put it in auth for now as there's no accounts/ urls)
    Lists all users in the system.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [HasPermission('ASSIGN_PERMISSION')]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data, message="Users retrieved successfully")

class RegisterView(generics.CreateAPIView):
    """
    POST /auth/register/
    Creates a new user account.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
