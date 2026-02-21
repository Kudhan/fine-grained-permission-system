from django.db import models

class Function(models.Model):
    """
    Represents a granular permission (Function) in the system.
    Users are mapped directly to these functions.
    """
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=100, unique=True)  # e.g., CREATE_EMPLOYEE
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.code})"

    def save(self, *args, **kwargs):
        self.code = self.code.upper()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Function"
        verbose_name_plural = "Functions"
        ordering = ['name']
