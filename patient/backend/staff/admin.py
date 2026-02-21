from django.contrib import admin
from .models import MedicalStaff

@admin.register(MedicalStaff)
class MedicalStaffAdmin(admin.ModelAdmin):
    list_display = ('name', 'specialty', 'department', 'license_number', 'is_available')
    list_filter = ('specialty', 'department', 'is_available')
    search_fields = ('name', 'specialty', 'license_number')
