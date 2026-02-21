from rest_framework import serializers
from .models import MedicalDocument

class MedicalDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MedicalDocument
        fields = '__all__'
        read_only_fields = ('file_size', 'mime_type', 'created_at', 'updated_at')
    
    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None
