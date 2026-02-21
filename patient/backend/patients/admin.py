from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('omang', 'first_name', 'last_name', 'cellphone', 'medical_aid', 'location')
    search_fields = ('omang', 'first_name', 'last_name', 'cellphone')
    list_filter = ('medical_aid', 'location')
