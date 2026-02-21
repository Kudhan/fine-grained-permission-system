from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.permissions.models import Function
from apps.employees.models import Employee

class PermissionEnforcementTests(APITestCase):
    """
    Tests for strict permission enforcement across API endpoints.
    """
    def setUp(self):
        # Create users
        self.admin = User.objects.create_user(email='admin@example.com', password='password', first_name='Admin')
        self.user = User.objects.create_user(email='user@example.com', password='password', first_name='User')
        
        # Create permissions
        self.perm_view = Function.objects.create(code='VIEW_EMPLOYEE', name='View Employee')
        self.perm_create = Function.objects.create(code='CREATE_EMPLOYEE', name='Create Employee')
        self.perm_assign = Function.objects.create(code='ASSIGN_PERMISSION', name='Assign Permission')
        
        # Admin gets ASSIGN_PERMISSION
        self.admin.functions.add(self.perm_assign)
        
        # URLs
        self.employee_url = reverse('employee-list')
        self.assign_url = reverse('permission_assign')

    def test_unauthorized_access(self):
        # User without VIEW_EMPLOYEE attempts to list employees
        login_response = self.client.post(reverse('token_obtain_pair'), {'email': 'user@example.com', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login_response.data["access"]}')
        
        response = self.client.get(self.employee_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_access(self):
        # User gets VIEW_EMPLOYEE
        self.user.functions.add(self.perm_view)
        
        login_response = self.client.post(reverse('token_obtain_pair'), {'email': 'user@example.com', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login_response.data["access"]}')
        
        response = self.client.get(self.employee_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_permission_assignment(self):
        # Admin assigns CREATE_EMPLOYEE to User
        login_response = self.client.post(reverse('token_obtain_pair'), {'email': 'admin@example.com', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login_response.data["access"]}')
        
        data = {
            'user_id': self.user.id,
            'permission_codes': ['CREATE_EMPLOYEE']
        }
        response = self.client.post(self.assign_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.user.functions.filter(code='CREATE_EMPLOYEE').exists())

    def test_employee_creation_with_permission(self):
        # User gets CREATE_EMPLOYEE
        self.user.functions.add(self.perm_create)
        
        login_response = self.client.post(reverse('token_obtain_pair'), {'email': 'user@example.com', 'password': 'password'})
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {login_response.data["access"]}')
        
        emp_data = {
            'first_name': 'New',
            'last_name': 'Employee',
            'email': 'new@example.com',
            'department': 'HR',
            'designation': 'Manager',
            'date_joined': '2024-01-01'
        }
        response = self.client.post(self.employee_url, emp_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 1)
        self.assertEqual(Employee.objects.get().created_by, self.user)
