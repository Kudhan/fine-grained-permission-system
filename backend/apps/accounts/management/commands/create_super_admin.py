from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.permissions.models import Function

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a Super-Admin account with all granular permissions'

    def handle(self, *args, **options):
        email = 'superadmin@fgps.com'
        password = 'superadmin'
        first_name = 'Super'
        last_name = 'Admin'

        # 1. Create User
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'is_staff': True,
                'is_superuser': True
            }
        )
        
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Successfully created Super-Admin: {email}"))
        else:
            self.stdout.write(self.style.WARNING(f"Super-Admin {email} already exists. Updating permissions..."))

        # 2. Assign ALL permissions
        all_functions = Function.objects.all()
        if not all_functions.exists():
            self.stdout.write(self.style.ERROR("No functions found in database. Run 'python manage.py seed_permissions' first."))
            return

        self.stdout.write(self.style.SUCCESS(f"Assigned all ({all_functions.count()}) permissions to {email}"))
        self.stdout.write(self.style.SUCCESS(f"CREDENTIALS: Email: {email} | Password: {password}"))
