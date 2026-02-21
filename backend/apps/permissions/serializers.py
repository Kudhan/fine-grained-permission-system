from rest_framework import serializers

class PermissionAssignmentSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    permission_codes = serializers.ListField(
        child=serializers.CharField()
    )
