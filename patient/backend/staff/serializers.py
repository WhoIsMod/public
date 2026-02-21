from rest_framework import serializers
from .models import MedicalStaff

class MedicalStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalStaff
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
