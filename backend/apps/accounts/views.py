from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer
)
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

class ChangePasswordView(generics.UpdateAPIView):
    """
    PATCH /auth/change-password/
    Allows user to change their password.
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return api_response(
                    message="Wrong password",
                    errors={"old_password": ["Wrong password."]},
                    status_code=400
                )

            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return api_response(message="Password updated successfully")

        return api_response(
            message="Password update failed",
            errors=serializer.errors,
            status_code=400
        )

from rest_framework.pagination import PageNumberPagination

class StandardResultsPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class UserListView(generics.ListAPIView):
    """
    Lists all users in the system with search and pagination.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    pagination_class = StandardResultsPagination
    permission_classes = [HasPermission('ASSIGN_PERMISSION')]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email']
    ordering_fields = ['first_name', 'last_name', 'email', 'date_joined']

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return api_response(data=response.data, message="Users retrieved successfully")

class RegisterView(generics.CreateAPIView):
    """
    POST /auth/register/
    Creates a new user account.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

from rest_framework.views import APIView
from apps.permissions.models import Function

class SystemGenesisView(APIView):
    """
    POST /auth/genesis/
    Critical bootstrap endpoint. Only works if NO superusers exist.
    Creates the first user, marks as superuser, and grants ALL permissions.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        if User.objects.filter(is_superuser=True).exists():
            return api_response(
                message="System Intelligence already online. Genesis protocol is locked.",
                status_code=403
            )

        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', 'System')
        last_name = request.data.get('last_name', 'Admin')

        if not email or not password:
            return api_response(message="Incomplete credentials.", status_code=400)

        # 1. Create the User
        user = User.objects.create_superuser(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # 2. Seed permissions if they don't exist
        perms_to_seed = [
            {'code': 'CREATE_EMPLOYEE', 'name': 'Create Employee', 'description': 'Allows creating new employee records'},
            {'code': 'EDIT_EMPLOYEE', 'name': 'Edit Employee', 'description': 'Allows editing existing employee records'},
            {'code': 'DELETE_EMPLOYEE', 'name': 'Delete Employee', 'description': 'Allows deleting employee records'},
            {'code': 'VIEW_EMPLOYEE', 'name': 'View Employees', 'description': 'Allows viewing the list of employees'},
            {'code': 'VIEW_SELF', 'name': 'View Self', 'description': 'Allows viewing own profile details'},
            {'code': 'ASSIGN_PERMISSION', 'name': 'Assign Permission', 'description': 'Allows assigning permissions to other users'},
        ]

        assigned_perms = []
        for p in perms_to_seed:
            obj, _ = Function.objects.get_or_create(code=p['code'], defaults={'name': p['name'], 'description': p['description']})
            user.functions.add(obj)
            assigned_perms.append(p['code'])

        return api_response(
            data={
                "id": user.id,
                "email": user.email,
                "permissions_granted": assigned_perms
            },
            message="Genesis complete. Master Principal identity created with full structural authority."
        )
