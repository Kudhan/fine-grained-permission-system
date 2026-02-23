from django.core.management.base import BaseCommand
from apps.accounts.models import User
from apps.permissions.models import Function
from apps.employees.models import Employee
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seeds the database with permissions, admin user, and mock employees'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # 1. Create Permissions
        perms = [
            ('CREATE_EMPLOYEE', 'Create Employee'),
            ('EDIT_EMPLOYEE', 'Edit Employee'),
            ('DELETE_EMPLOYEE', 'Delete Employee'),
            ('VIEW_EMPLOYEE', 'View Employee'),
            ('VIEW_SELF', 'View Self'),
            ('ASSIGN_PERMISSION', 'Assign Permission'),
        ]
        
        func_objects = []
        for code, name in perms:
            func, created = Function.objects.get_or_create(code=code, defaults={'name': name})
            func_objects.append(func)
            if created:
                self.stdout.write(f"Created permission: {code}")

        # 2. Create Admin User
        admin_email = "admin@fgps.com"
        admin, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'first_name': 'System',
                'last_name': 'Administrator',
                'is_active': True,
            }
        )
        if created:
            admin.set_password("adminfgps")
            admin.save()
            self.stdout.write(f"Created admin user: {admin_email}")
        
        # Assign all permissions to admin
        admin.functions.add(*func_objects)

        # 3. Create Mock Employees
        departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Product']
        designations = ['Manager', 'Senior Developer', 'Junior Developer', 'Specialist', 'Analyst', 'Director']
        
        first_names = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth']
        last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']

        for i in range(20):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            email = f"{first_name.lower()}.{last_name.lower()}.{i}@example.com"
            
            if not Employee.objects.filter(email=email).exists():
                Employee.objects.create(
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    phone=f"+1-555-0{random.randint(100, 999)}",
                    department=random.choice(departments),
                    designation=random.choice(designations),
                    date_joined=timezone.now().date(),
                    created_by=admin
                )
        
        self.stdout.write(self.style.SUCCESS("Successfully seeded data!"))
