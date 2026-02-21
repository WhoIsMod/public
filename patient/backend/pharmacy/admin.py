from django.contrib import admin
from .models import Medication, Prescription, Order

@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'generic_name', 'price', 'stock_quantity', 'requires_prescription')
    list_filter = ('requires_prescription',)
    search_fields = ('name', 'generic_name')

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('patient', 'medication', 'quantity', 'status', 'prescribed_by', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('patient__first_name', 'patient__last_name', 'medication__name')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'patient', 'total_amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'patient__first_name', 'patient__last_name')
