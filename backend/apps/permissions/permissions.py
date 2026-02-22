from rest_framework import permissions

class HasPermission(permissions.BasePermission):
    """
    Custom permission class that checks if the user has a specific function code.
    Usage:
        permission_classes = [HasPermission('CREATE_EMPLOYEE')]
    """
    def __init__(self, required_code=None):
        self.required_code = required_code

    def __call__(self):
        return self

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
            
        # Superusers bypass granular permission checks
        if request.user.is_superuser:
            return True

        # Check if the user has the required permission code
        return request.user.functions.filter(code=self.required_code.upper()).exists()
