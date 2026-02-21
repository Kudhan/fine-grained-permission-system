from rest_framework import generics, status, views
from .serializers import PermissionAssignmentSerializer
from .models import Function
from apps.accounts.models import User
from .permissions import HasPermission
from apps.core.utils import api_response
from apps.audit.models import AuditLog

class PermissionActionBaseView(views.APIView):
    permission_classes = [HasPermission('ASSIGN_PERMISSION')]
    serializer_class = PermissionAssignmentSerializer

    def get_functions(self, codes):
        return Function.objects.filter(code__in=[c.upper() for c in codes])

class AssignPermissionView(PermissionActionBaseView):
    """
    POST /permissions/assign/
    Assigns multiple permissions to a user.
    """
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = generics.get_object_or_404(User, id=serializer.validated_data['user_id'])
            functions = self.get_functions(serializer.validated_data['permission_codes'])
            user.functions.add(*functions)
            
            # Create Audit Logs
            for func in functions:
                AuditLog.objects.create(
                    action='PERMISSION_ASSIGNED',
                    performed_by=request.user,
                    target_user=user,
                    permission_code=func.code
                )
            
            return api_response(message="Permissions assigned successfully", status_code=status.HTTP_200_OK)
        return api_response(message="Validation failed", status_code=status.HTTP_400_BAD_REQUEST, errors=serializer.errors)

class RemovePermissionView(PermissionActionBaseView):
    """
    POST /permissions/remove/
    Removes multiple permissions from a user.
    """
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = generics.get_object_or_404(User, id=serializer.validated_data['user_id'])
            functions = self.get_functions(serializer.validated_data['permission_codes'])
            user.functions.remove(*functions)

            # Create Audit Logs
            for func in functions:
                AuditLog.objects.create(
                    action='PERMISSION_REMOVED',
                    performed_by=request.user,
                    target_user=user,
                    permission_code=func.code
                )

            return api_response(message="Permissions removed successfully", status_code=status.HTTP_200_OK)
        return api_response(message="Validation failed", status_code=status.HTTP_400_BAD_REQUEST, errors=serializer.errors)
