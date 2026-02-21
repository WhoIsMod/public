from rest_framework import serializers
from .models import Appointment
from patients.serializers import PatientSerializer
from staff.serializers import MedicalStaffSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    patient_details = PatientSerializer(source='patient', read_only=True)
    staff_details = MedicalStaffSerializer(source='staff', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
