import os
import django
import sys

# Add backend to path
sys.path.append('d:/projects/fine-grained-permission-system/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

def test_serializer(cls, name):
    try:
        print(f"\nTesting {name} initialization...")
        serializer = cls()
        print(f"{name} fields: {list(serializer.fields.keys())}")
        print(f"Initialization successful!")
    except Exception as e:
        print(f"FAILED {name}: {type(e).__name__}: {e}")

test_serializer(CustomTokenObtainPairSerializer, "CustomTokenObtainPairSerializer")
test_serializer(TokenObtainPairSerializer, "TokenObtainPairSerializer")
