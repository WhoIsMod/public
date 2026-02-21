from rest_framework import serializers
from .models import MedicalRecord
from patients.serializers import PatientSerializer

class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    
    class Meta:
        model = MedicalRecord
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
