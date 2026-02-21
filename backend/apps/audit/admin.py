from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'target_user', 'performed_by', 'permission_code', 'timestamp')
    list_filter = ('action', 'timestamp')
    search_fields = ('target_user__email', 'performed_by__email', 'permission_code')
    readonly_fields = ('action', 'target_user', 'performed_by', 'permission_code', 'timestamp')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
