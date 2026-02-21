from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

class MeView(generics.RetrieveAPIView):
    """
    GET /auth/me/
    Returns the current user details and their permissions.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
