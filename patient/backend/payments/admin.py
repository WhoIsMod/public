from django.contrib import admin
from .models import Bill, Payment

@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ('bill_number', 'patient', 'bill_type', 'total_amount', 'status', 'due_date')
    list_filter = ('status', 'bill_type', 'due_date')
    search_fields = ('bill_number', 'patient__first_name', 'patient__last_name')

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_number', 'bill', 'patient', 'amount', 'payment_method', 'status', 'payment_date')
    list_filter = ('status', 'payment_method', 'payment_date')
    search_fields = ('payment_number', 'transaction_id', 'bill__bill_number')
