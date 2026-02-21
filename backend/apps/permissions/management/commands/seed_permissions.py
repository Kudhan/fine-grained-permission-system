from django.core.management.base import BaseCommand
from apps.permissions.models import Function

class Command(BaseCommand):
    help = 'Seeds initial fallback permissions for the system'

    def handle(self, *args, **options):
        permissions = [
            {'code': 'CREATE_EMPLOYEE', 'name': 'Create Employee', 'description': 'Allows creating new employee records'},
            {'code': 'EDIT_EMPLOYEE', 'name': 'Edit Employee', 'description': 'Allows editing existing employee records'},
            {'code': 'DELETE_EMPLOYEE', 'name': 'Delete Employee', 'description': 'Allows deleting employee records'},
            {'code': 'VIEW_EMPLOYEE', 'name': 'View Employees', 'description': 'Allows viewing the list of employees'},
            {'code': 'VIEW_SELF', 'name': 'View Self', 'description': 'Allows viewing own profile details'},
            {'code': 'ASSIGN_PERMISSION', 'name': 'Assign Permission', 'description': 'Allows assigning permissions to other users'},
        ]

        for perm_data in permissions:
            obj, created = Function.objects.get_or_create(
                code=perm_data['code'],
                defaults={
                    'name': perm_data['name'],
                    'description': perm_data['description']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created permission: {perm_data['code']}"))
            else:
                self.stdout.write(self.style.WARNING(f"Permission already exists: {perm_data['code']}"))

        self.stdout.write(self.style.SUCCESS('Seeding completed successfully.'))
