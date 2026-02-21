from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from .models import Employee
from .serializers import EmployeeSerializer
from apps.permissions.permissions import HasPermission
from apps.core.utils import api_response

class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Employee CRUD.
    Enforces strict permissions for each action.
    """
    queryset = Employee.objects.all().select_related('created_by')
    serializer_class = EmployeeSerializer

    def get_permissions(self):
        """
        Dynamically assign permissions based on action.
        """
        if self.action == 'create':
            permission_classes = [HasPermission('CREATE_EMPLOYEE')]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [HasPermission('EDIT_EMPLOYEE')]
        elif self.action == 'destroy':
            permission_classes = [HasPermission('DELETE_EMPLOYEE')]
        elif self.action in ['list', 'retrieve']:
            permission_classes = [HasPermission('VIEW_EMPLOYEE')]
        else:
            permission_classes = [HasPermission('VIEW_EMPLOYEE')]
        
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        return api_response(data=response.data, message="Employees retrieved successfully")

    def retrieve(self, request, *args, **kwargs):
        response = super().retrieve(request, *args, **kwargs)
        return api_response(data=response.data, message="Employee details retrieved successfully")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return api_response(data=serializer.data, message="Employee created successfully", status_code=status.HTTP_201_CREATED)
        return api_response(message="Creation failed", errors=serializer.errors, status_code=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return api_response(data=response.data, message="Employee updated successfully")

    def destroy(self, request, *args, **kwargs):
        super().destroy(request, *args, **kwargs)
        return api_response(message="Employee deleted successfully", status_code=status.HTTP_204_NO_CONTENT)

class ViewSelfEmployeeView(generics.RetrieveAPIView):
    """
    GET /employees/me/
    Returns the employee record for the logged-in user (matched by email).
    """
    serializer_class = EmployeeSerializer
    permission_classes = [HasPermission('VIEW_SELF')]

    def get_object(self):
        return generics.get_object_or_404(Employee, email=self.request.user.email)

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return api_response(data=serializer.data, message="Personal employee profile retrieved successfully")
