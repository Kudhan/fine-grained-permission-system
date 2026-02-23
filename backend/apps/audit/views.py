from rest_framework import generics, permissions, filters
from .models import AuditLog
from .serializers import AuditLogSerializer
from apps.core.utils import api_response

class AuditLogListView(generics.ListAPIView):
    """
    GET /audit/logs/
    Returns a list of all audit logs with pagination support.
    Supports searching by target email, action, or permission code.
    """
    queryset = AuditLog.objects.all().select_related('performed_by', 'target_user')
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['target_user__email', 'action', 'permission_code', 'performed_by__email']
    ordering_fields = ['timestamp', 'action']
    ordering = ['-timestamp']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Additional manual filtering if needed (keeping backward compatibility)
        target_email = request.query_params.get('target_email')
        if target_email:
            queryset = queryset.filter(target_user__email=target_email)
            
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated_data = self.get_paginated_response(serializer.data).data
            return api_response(data=paginated_data, message="Audit logs retrieved successfully")

        serializer = self.get_serializer(queryset, many=True)
        return api_response(data=serializer.data, message="Audit logs retrieved successfully")
