from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import UserSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /auth/login/
    Custom login view that accepts email instead of username.
    """
    serializer_class = CustomTokenObtainPairSerializer

class MeView(generics.RetrieveAPIView):
    """
    GET /auth/me/
    Returns the current user details and their permissions.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class RegisterView(generics.CreateAPIView):
    """
    POST /auth/register/
    Creates a new user account.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
