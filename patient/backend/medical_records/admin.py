from django.contrib import admin
from .models import MedicalRecord

@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('record_id', 'patient', 'heart_rate', 'chronic_illness', 'race', 'sex', 'created_at')
    search_fields = ('record_id', 'patient__first_name', 'patient__last_name', 'chronic_illness')
    list_filter = ('race', 'sex', 'chronic_illness', 'created_at')
