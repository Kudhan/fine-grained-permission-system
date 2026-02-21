import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.employees.models import Employee
from apps.audit.models import AuditLog
from apps.permissions.models import Function

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds mock employees and audit logs for demonstration purposes'

    def handle(self, *args, **options):
        # 1. Get or create a supervisor user
        superuser = User.objects.filter(is_superuser=True).first() or User.objects.first()
        if not superuser:
            self.stdout.write(self.style.ERROR('No user found to assign as creator. Please register a user first.'))
            return

        # 2. Mock Data Definitions
        departments = ['Engineering', 'Marketing', 'Sales', 'Human Resources', 'Security']
        designations = {
            'Engineering': ['Senior Engineer', 'Frontend Developer', 'Backend Specialist', 'Security Analyst'],
            'Marketing': ['Content Manager', 'Growth Specialist', 'Designer'],
            'Sales': ['Account Executive', 'Sales Lead'],
            'Human Resources': ['HR Manager', 'Recruiter'],
            'Security': ['CISO', 'Security Engineer', 'Access Controller']
        }
        
        names = [
            ('Alice', 'Johnson'), ('Bob', 'Smith'), ('Charlie', 'Davis'), 
            ('Diana', 'Prince'), ('Ethan', 'Hunt'), ('Fiona', 'Gallagher'),
            ('George', 'Costanza'), ('Hannah', 'Baker'), ('Ian', 'Malcolm'),
            ('Jane', 'Doe'), ('Kevin', 'Hart'), ('Laura', 'Palmer')
        ]

        # 3. Create Employees
        self.stdout.write('Seeding employees...')
        for first, last in names:
            email = f"{first.lower()}.{last.lower()}@example.com"
            department = random.choice(departments)
            designation = random.choice(designations[department])
            
            # Simple unique email check
            if not Employee.objects.filter(email=email).exists():
                Employee.objects.create(
                    first_name=first,
                    last_name=last,
                    email=email,
                    department=department,
                    designation=designation,
                    date_joined=date.today() - timedelta(days=random.randint(0, 365)),
                    created_by=superuser
                )
                self.stdout.write(f"Created employee: {first} {last}")

        # 4. Create Mock Audit Logs
        self.stdout.write('Seeding audit logs...')
        users = User.objects.all()
        functions = Function.objects.all()
        
        if users.count() >= 1 and functions.exists():
            for _ in range(15):
                target = random.choice(users)
                func = random.choice(functions)
                action = random.choice(['PERMISSION_ASSIGNED', 'PERMISSION_REMOVED'])
                
                AuditLog.objects.create(
                    action=action,
                    performed_by=superuser,
                    target_user=target,
                    permission_code=func.code
                )
            self.stdout.write(self.style.SUCCESS('Seeding audit logs completed.'))

        self.stdout.write(self.style.SUCCESS('Mock data seeding finished successfully.'))
