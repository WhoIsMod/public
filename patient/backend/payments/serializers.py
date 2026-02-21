from rest_framework import serializers
from .models import Bill, Payment

class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'
        read_only_fields = ('bill_number', 'created_at', 'updated_at')

class PaymentSerializer(serializers.ModelSerializer):
    bill_details = BillSerializer(source='bill', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('payment_number', 'transaction_id', 'payment_date', 'created_at', 'updated_at')
