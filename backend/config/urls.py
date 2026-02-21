from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from apps.accounts.views import MeView, RegisterView, CustomTokenObtainPairView, UserListView
from apps.permissions.views import AssignPermissionView, RemovePermissionView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth Endpoints
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/register/', RegisterView.as_view(), name='token_register'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='auth_me'),
    path('auth/users/', UserListView.as_view(), name='user_list'),
    
    # Permission Endpoints
    path('permissions/assign/', AssignPermissionView.as_view(), name='permission_assign'),
    path('permissions/remove/', RemovePermissionView.as_view(), name='permission_remove'),
    
    # Employee Endpoints
    path('employees/', include('apps.employees.urls')),

    # Audit Endpoints
    path('audit/', include('apps.audit.urls')),
]
