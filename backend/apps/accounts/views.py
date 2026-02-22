from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, filters
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import User
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer
)
from rest_framework_simplejwt.views import TokenObtainPairView
from apps.permissions.permissions import HasPermission
from apps.permissions.models import Function

# Use a wrapper for response to keep the frontend working
# But we will write the logic inside the views very manually
def junior_response(data=None, message="", success=True, errors=None, status_code=200):
    return Response({
        "success": success,
        "message": message,
        "data": data,
        "errors": errors
    }, status=status_code)

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    This is for logging in.
    """
    serializer_class = CustomTokenObtainPairSerializer

class MeView(APIView):
    """
    This view shows the current user profile or updates it.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # We get the user who is logged in
        the_user = request.user
        # Convert user to JSON
        user_data = UserSerializer(the_user).data
        # Send it back
        return junior_response(data=user_data, message="Profile retrieved successfully")

    def patch(self, request):
        # We want to update the profile
        the_user = request.user
        # Use partial=True so we don't need all fields
        serializer = UserSerializer(the_user, data=request.data, partial=True)

        # Check if the data is correct
        if serializer.is_valid():
            # Save the user
            updated_user = serializer.save()

            # We also need to keep the employee table in sync
            # This is extra logic a junior might write manually
            from apps.employees.models import Employee
            
            # Look for existing employee
            email_of_user = updated_user.email
            employee_list = Employee.objects.filter(email=email_of_user)
            
            if employee_list.exists():
                # Update existing one
                emp = employee_list.first()
                if 'first_name' in request.data:
                    emp.first_name = request.data['first_name']
                if 'last_name' in request.data:
                    emp.last_name = request.data['last_name']
                if 'phone' in request.data:
                    emp.phone = request.data['phone']
                if 'department' in request.data:
                    emp.department = request.data['department']
                if 'designation' in request.data:
                    emp.designation = request.data['designation']
                emp.save()
            else:
                # Create a new one
                Employee.objects.create(
                    email=email_of_user,
                    first_name=updated_user.first_name,
                    last_name=updated_user.last_name,
                    department=request.data.get('department', 'Unassigned'),
                    designation=request.data.get('designation', 'Staff'),
                    date_joined=timezone.now().date(),
                    phone=request.data.get('phone', '')
                )

            # Get the fresh data to return
            final_data = UserSerializer(updated_user).data
            return junior_response(data=final_data, message="Profile updated successfully")
        
        # If there are errors
        return junior_response(
            message="Update failed", 
            errors=serializer.errors, 
            success=False, 
            status_code=400
        )

class ChangePasswordView(APIView):
    """
    This view allows changing the password.
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        # Get the user
        user = request.user
        # Use simple dictionary to check data
        old_pass = request.data.get("old_password")
        new_pass = request.data.get("new_password")
        conf_pass = request.data.get("confirm_password")

        # 1. Check if all fields are there
        if not old_pass or not new_pass or not conf_pass:
            return junior_response(message="All fields are required", success=False, status_code=400)

        # 2. Check if new passwords match
        if new_pass != conf_pass:
            return junior_response(message="New passwords do not match", success=False, status_code=400)

        # 3. Check if old password is correct
        if not user.check_password(old_pass):
            return junior_response(message="Wrong old password", success=False, status_code=400)

        # 4. Set the new password
        user.set_password(new_pass)
        user.save()

        return junior_response(message="Password updated successfully")

class UserListView(APIView):
    """
    Shows a list of all users.
    """
    permission_classes = [HasPermission('ASSIGN_PERMISSION')]

    def get(self, request):
        # Get all users and order them
        all_users = User.objects.all().order_by('-date_joined')
        
        # Hand-made search logic
        search_query = request.query_params.get('search', None)
        if search_query:
            from django.db.models import Q
            all_users = all_users.filter(
                Q(first_name__icontains=search_query) | 
                Q(last_name__icontains=search_query) | 
                Q(email__icontains=search_query)
            )

        # Manual pagination
        paginator = PageNumberPagination()
        paginator.page_size = 5
        result_page = paginator.paginate_queryset(all_users, request)
        
        # Serialize the data
        serializer = UserSerializer(result_page, many=True)
        
        # Return paginated response
        return paginator.get_paginated_response(serializer.data)

class RegisterView(APIView):
    """
    Creates a new user account.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Get the data
        user_data = request.data
        # Use serializer to validate
        reg_serializer = UserRegistrationSerializer(data=user_data)
        
        if reg_serializer.is_valid():
            # Create user
            new_user = reg_serializer.save()
            return junior_response(
                data={"id": new_user.id, "email": new_user.email},
                message="User registered successfully",
                status_code=201
            )
            
        # Error case
        return junior_response(
            message="Registration failed",
            errors=reg_serializer.errors,
            success=False,
            status_code=400
        )

class SystemGenesisView(APIView):
    """
    Special view to create first admin.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Check if we already have an admin
        existing_admins = User.objects.filter(is_superuser=True)
        if existing_admins.exists():
            return junior_response(
                message="System Intelligence already online. Genesis protocol is locked.",
                success=False,
                status_code=403
            )

        # Manual data extraction
        user_email = request.data.get('email')
        user_pass = request.data.get('password')
        fname = request.data.get('first_name', 'System')
        lname = request.data.get('last_name', 'Admin')

        if not user_email or not user_pass:
            return junior_response(message="Incomplete credentials.", success=False, status_code=400)

        # Step 1: Create the User
        master_user = User.objects.create_superuser(
            email=user_email,
            password=user_pass,
            first_name=fname,
            last_name=lname
        )

        # Step 2: Look for permissions
        permissions_list = [
            {'code': 'CREATE_EMPLOYEE', 'name': 'Create Employee'},
            {'code': 'EDIT_EMPLOYEE', 'name': 'Edit Employee'},
            {'code': 'DELETE_EMPLOYEE', 'name': 'Delete Employee'},
            {'code': 'VIEW_EMPLOYEE', 'name': 'View Employees'},
            {'code': 'VIEW_SELF', 'name': 'View Self'},
            {'code': 'ASSIGN_PERMISSION', 'name': 'Assign Permission'},
        ]

        # Give all permissions
        added_codes = []
        for p_data in permissions_list:
            # Get or create it
            perm_obj, was_created = Function.objects.get_or_create(
                code=p_data['code'], 
                defaults={'name': p_data['name']}
            )
            # Add to user
            master_user.functions.add(perm_obj)
            added_codes.append(p_data['code'])

        return junior_response(
            data={
                "id": master_user.id,
                "email": master_user.email,
                "permissions": added_codes
            },
            message="Genesis complete. Master Principal identity created."
        )
