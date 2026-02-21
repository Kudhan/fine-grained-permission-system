from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import UserSerializer, UserRegistrationSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.core.utils import api_response
from apps.permissions.permissions import HasPermission
from .models import User

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

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return api_response(data=serializer.data, message="Profile retrieved successfully")

class UserListView(generics.ListAPIView):
    """
    GET /auth/users/ (Wait, I'll put it in auth for now as there's no accounts/ urls)
    Lists all users in the system.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [HasPermission('ASSIGN_PERMISSION')]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data, message="Users retrieved successfully")

class RegisterView(generics.CreateAPIView):
    """
    POST /auth/register/
    Creates a new user account.
    """
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
