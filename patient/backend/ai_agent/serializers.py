from rest_framework import serializers
from .models import AIInterpretation
from documents.serializers import MedicalDocumentSerializer

class AIInterpretationSerializer(serializers.ModelSerializer):
    document_details = MedicalDocumentSerializer(source='document', read_only=True)
    
    class Meta:
        model = AIInterpretation
        fields = '__all__'
        read_only_fields = ('created_at',)
