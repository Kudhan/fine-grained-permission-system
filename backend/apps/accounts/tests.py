from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.permissions.models import Function

class AuthAndPermissionTests(APITestCase):
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'password': 'Password123!',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = User.objects.create_user(**self.user_data)
        self.login_url = reverse('token_obtain_pair')
        self.me_url = reverse('auth_me')
        self.assign_url = reverse('permission_assign')

    def test_login_success(self):
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_get_me_details(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user.email)

    def test_permission_assignment_unauthorized(self):
        # User doesn't have ASSIGN_PERMISSION
        admin_user = User.objects.create_user(email='admin@ex.com', password='p', first_name='A', last_name='U')
        self.client.force_authenticate(user=self.user)
        
        perm = Function.objects.create(code='VIEW_EMPLOYEE', name='View')
        response = self.client.post(self.assign_url, {
            'user_id': admin_user.id,
            'permission_codes': ['VIEW_EMPLOYEE']
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_permission_assignment_authorized(self):
        # Give user ASSIGN_PERMISSION
        assign_perm = Function.objects.create(code='ASSIGN_PERMISSION', name='Assign')
        self.user.functions.add(assign_perm)
        
        target_user = User.objects.create_user(email='target@ex.com', password='p', first_name='T', last_name='U')
        self.client.force_authenticate(user=self.user)
        
        view_perm = Function.objects.create(code='VIEW_EMPLOYEE', name='View')
        response = self.client.post(self.assign_url, {
            'user_id': target_user.id,
            'permission_codes': ['VIEW_EMPLOYEE']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(target_user.functions.filter(code='VIEW_EMPLOYEE').exists())
