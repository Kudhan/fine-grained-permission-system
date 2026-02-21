import os
import sys
import django
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from apps.accounts.models import User

def simulate_login():
    email = "admin@saas.com"
    password = "Admin123!"
    print(f"Attempting to authenticate {email}...")
    try:
        user = authenticate(email=email, password=password)
        if user:
            print(f"Authentication successful for {user.email}")
            refresh = RefreshToken.for_user(user)
            print("Token generation successful!")
            print(f"Access: {str(refresh.access_token)[:20]}...")
        else:
            print("Authentication failed (Invalid credentials)")
    except Exception as e:
        print(f"CRASH during login simulation: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    simulate_login()
