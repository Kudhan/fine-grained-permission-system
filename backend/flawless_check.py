import os
import sys
import django
import json
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test.client import Client
from apps.accounts.models import User
from apps.employees.models import Employee

def run_flawless_check():
    client = Client()
    print("--- Phase 1: Registration Check ---")
    reg_data = {
        "email": "migration_tester@shubakar.com",
        "password": "Password123!",
        "first_name": "Migration",
        "last_name": "Tester"
    }
    
    # Check if user already exists (cleanup)
    User.objects.filter(email=reg_data['email']).delete()
    
    response = client.post("/auth/register/", data=json.dumps(reg_data), content_type="application/json")
    print(f"Registration Status: {response.status_code}")
    if response.status_code == 201:
        print("Registration: SUCCESS")
    else:
        print(f"Registration: FAILED - {response.content}")
        return

    print("\n--- Phase 2: Login Check ---")
    login_data = {
        "email": reg_data['email'],
        "password": reg_data['password']
    }
    response = client.post("/auth/login/", data=json.dumps(login_data), content_type="application/json")
    print(f"Login Status: {response.status_code}")
    if response.status_code == 200:
        token = response.json().get('access')
        print(f"Login: SUCCESS (Token: {token[:20]}...)")
    else:
        print(f"Login: FAILED - {response.content}")
        return

    print("\n--- Phase 3: Resource Check (Employees as Superuser) ---")
    # Use the superuser created by the user or create one for testing
    admin_email = "admin_verify@shubakar.com"
    if not User.objects.filter(email=admin_email).exists():
        admin_user = User.objects.create_superuser(email=admin_email, password="Password123!", first_name="Admin", last_name="Verify")
    else:
        admin_user = User.objects.get(email=admin_email)
    
    # Login as admin to get token
    login_data = {"email": admin_email, "password": "Password123!"}
    response = client.post("/auth/login/", data=json.dumps(login_data), content_type="application/json")
    admin_token = response.json().get('access')
    
    headers = {"HTTP_AUTHORIZATION": f"Bearer {admin_token}"}
    emp_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@shubakar.com",
        "department": "Engineering",
        "designation": "System Architect",
        "date_joined": "2024-01-01"
    }
    
    # Cleanup
    Employee.objects.filter(email=emp_data['email']).delete()
    
    response = client.post("/employees/", data=json.dumps(emp_data), content_type="application/json", **headers)
    print(f"Create Employee Status: {response.status_code}")
    if response.status_code == 201:
        print("Employee Creation: SUCCESS")
    else:
        print(f"Employee Creation: FAILED - {response.content}")

    print("\n--- Phase 4: Data Persistence Check ---")
    user_count = User.objects.filter(email=reg_data['email']).count()
    emp_count = Employee.objects.filter(email=emp_data['email']).count()
    print(f"User in DB: {'YES' if user_count > 0 else 'NO'}")
    print(f"Employee in DB: {'YES' if emp_count > 0 else 'NO'}")
    
    # Cleanup verification data
    User.objects.filter(email=reg_data['email']).delete()
    User.objects.filter(email=admin_email).delete()
    Employee.objects.filter(email=emp_data['email']).delete()

if __name__ == "__main__":
    run_flawless_check()
