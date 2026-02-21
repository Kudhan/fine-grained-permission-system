from rest_framework import generics, permissions
from .models import AuditLog
from .serializers import AuditLogSerializer
from apps.permissions.permissions import HasPermission
from apps.core.utils import api_response

class AuditLogListView(generics.ListAPIView):
    """
    GET /audit/logs/
    Returns a list of all audit logs. 
    Restricted to users with VIEW_AUDIT_LOG permission or similar.
    """
    queryset = AuditLog.objects.all().select_related('performed_by', 'target_user')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated] # For now, allow all auth users to see local logs or restrict to admin

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Optional filtering
        target_email = request.query_params.get('target_email')
        if target_email:
            queryset = queryset.filter(target_user__email=target_email)
            
        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data, message="Audit logs retrieved successfully")
