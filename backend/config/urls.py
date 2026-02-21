from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.accounts.views import MeView
from apps.permissions.views import AssignPermissionView, RemovePermissionView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth Endpoints
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='auth_me'),
    
    # Permission Endpoints
    path('permissions/assign/', AssignPermissionView.as_view(), name='permission_assign'),
    path('permissions/remove/', RemovePermissionView.as_view(), name='permission_remove'),
    
    # Employee Endpoints
    path('employees/', include('apps.employees.urls')),
]
