from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.permissions.models import Function
from apps.employees.models import Employee
from datetime import date

class EmployeeSecurityTests(APITestCase):
    def setUp(self):
        # Create permissions
        self.view_perm = Function.objects.create(code='VIEW_EMPLOYEE', name='View Employee')
        self.create_perm = Function.objects.create(code='CREATE_EMPLOYEE', name='Create Employee')
        
        # Create users
        self.admin_user = User.objects.create_user(email='admin@test.com', password='password123', first_name='Admin', last_name='User')
        self.regular_user = User.objects.create_user(email='user@test.com', password='password123', first_name='Regular', last_name='User')
        
        # Assign permissions to admin
        self.admin_user.functions.add(self.view_perm, self.create_perm)
        
        # Create an employee
        self.employee = Employee.objects.create(
            first_name='John', last_name='Doe', email='john@company.com',
            department='Tech', designation='Developer', date_joined=date.today(),
            created_by=self.admin_user
        )

    def test_list_employees_with_permission(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('employee-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_list_employees_without_permission(self):
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('employee-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_employee_with_permission(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('employee-list')
        data = {
            'first_name': 'Jane', 'last_name': 'Smith', 'email': 'jane@company.com',
            'department': 'HR', 'designation': 'Manager', 'date_joined': '2023-01-01'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 2)

    def test_view_self_flow(self):
        # Create an employee record matching the regular user's email
        self.view_self_perm = Function.objects.create(code='VIEW_SELF', name='View Self')
        self.regular_user.functions.add(self.view_self_perm)
        
        Employee.objects.create(
            first_name='Regular', last_name='User', email=self.regular_user.email,
            department='Sales', designation='Rep', date_joined=date.today()
        )
        
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('employee-me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['email'], self.regular_user.email)
