from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.permissions.models import Function
from apps.employees.models import Employee
from datetime import date

class EmployeeCRUDTests(APITestCase):
    def setUp(self):
        # Create permissions
        self.view_perm = Function.objects.create(code='VIEW_EMPLOYEE', name='View')
        self.create_perm = Function.objects.create(code='CREATE_EMPLOYEE', name='Create')
        self.edit_perm = Function.objects.create(code='EDIT_EMPLOYEE', name='Edit')
        self.delete_perm = Function.objects.create(code='DELETE_EMPLOYEE', name='Delete')
        
        # Create users
        self.admin = User.objects.create_user(email='admin@test.com', password='password123', first_name='Admin', last_name='User')
        self.admin.functions.add(self.view_perm, self.create_perm, self.edit_perm, self.delete_perm)
        
        self.staff = User.objects.create_user(email='staff@test.com', password='password123', first_name='Staff', last_name='User')
        
        # URL
        self.list_url = reverse('employee-list')

    def test_create_employee_success(self):
        self.client.force_authenticate(user=self.admin)
        data = {
            'first_name': 'New', 'last_name': 'Employee', 'email': 'new@test.com',
            'department': 'Dev', 'designation': 'Lead', 'date_joined': '2024-01-01'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 1)

    def test_duplicate_email_fails(self):
        Employee.objects.create(
            first_name='Existing', last_name='Emp', email='duplicate@test.com',
            department='HR', designation='Manager', date_joined=date.today()
        )
        self.client.force_authenticate(user=self.admin)
        data = {
            'first_name': 'New', 'last_name': 'Emp', 'email': 'duplicate@test.com',
            'department': 'Dev', 'designation': 'Dev', 'date_joined': '2024-01-01'
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_view_employee_details(self):
        emp = Employee.objects.create(
            first_name='John', last_name='Doe', email='john@test.com',
            department='Dev', designation='Dev', date_joined=date.today()
        )
        self.client.force_authenticate(user=self.admin)
        url = reverse('employee-detail', kwargs={'pk': emp.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['first_name'], 'John')

    def test_delete_employee(self):
        emp = Employee.objects.create(
            first_name='Exit', last_name='User', email='exit@test.com',
            department='Sales', designation='Rep', date_joined=date.today()
        )
        self.client.force_authenticate(user=self.admin)
        url = reverse('employee-detail', kwargs={'pk': emp.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Employee.objects.count(), 0)
