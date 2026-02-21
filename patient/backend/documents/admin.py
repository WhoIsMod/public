from django.contrib import admin
from .models import MedicalDocument

@admin.register(MedicalDocument)
class MedicalDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'patient', 'document_type', 'date_issued', 'created_at')
    list_filter = ('document_type', 'date_issued', 'created_at')
    search_fields = ('title', 'patient__first_name', 'patient__last_name')
