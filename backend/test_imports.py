import os
import sys
import django
from pathlib import Path

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

try:
    django.setup()
    print("Django setup successful!")
    from apps.accounts.models import User
    print("User model imported!")
    from apps.accounts.serializers import CustomTokenObtainPairSerializer
    print("CustomTokenObtainPairSerializer imported!")
except Exception as e:
    print(f"FAILED: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
