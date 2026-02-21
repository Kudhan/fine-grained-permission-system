from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    """
    Tracks sensitive actions in the system such as permission changes.
    """
    ACTION_CHOICES = [
        ('PERMISSION_ASSIGNED', 'Permission Assigned'),
        ('PERMISSION_REMOVED', 'Permission Removed'),
        ('ROLE_UPDATED', 'Role Updated'), # Future proofing
    ]

    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='audit_actions_performed'
    )
    target_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='audit_actions_received'
    )
    permission_code = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} on {self.target_user.email} by {self.performed_by.email if self.performed_by else 'System'}"

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Audit Log'
        verbose_name_plural = 'Audit Logs'
