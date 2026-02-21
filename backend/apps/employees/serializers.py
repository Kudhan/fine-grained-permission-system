from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    created_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')

    class Meta:
        model = Employee
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone', 
            'department', 'designation', 'date_joined', 
            'created_by', 'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def validate_email(self, value):
        """Check that the email is unique."""
        if Employee.objects.filter(email=value).exists():
            # If updating, allow the same email
            if self.instance and self.instance.email == value:
                return value
            raise serializers.ValidationError("An employee with this email already exists.")
        return value
