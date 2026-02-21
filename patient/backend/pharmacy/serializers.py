from rest_framework import serializers
from .models import Medication, Prescription, Order

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class PrescriptionSerializer(serializers.ModelSerializer):
    medication_details = MedicationSerializer(source='medication', read_only=True)
    
    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ('order_number', 'created_at', 'updated_at')
