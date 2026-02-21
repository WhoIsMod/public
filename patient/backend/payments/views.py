from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import uuid
from .models import Bill, Payment
from .serializers import BillSerializer, PaymentSerializer

class BillListView(generics.ListAPIView):
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Bill.objects.filter(patient=self.request.user)

class BillDetailView(generics.RetrieveAPIView):
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Bill.objects.filter(patient=self.request.user)

class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        payment_number = f"PAY-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(patient=self.request.user, payment_number=payment_number)

class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(patient=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def process_payment(request, bill_id):
    try:
        bill = Bill.objects.get(pk=bill_id, patient=request.user)
        payment_method = request.data.get('payment_method')
        transaction_id = request.data.get('transaction_id', '')
        
        if bill.status == 'PAID':
            return Response({'error': 'Bill already paid'}, status=status.HTTP_400_BAD_REQUEST)
        
        payment_number = f"PAY-{uuid.uuid4().hex[:8].upper()}"
        payment = Payment.objects.create(
            bill=bill,
            patient=request.user,
            payment_number=payment_number,
            amount=bill.total_amount,
            payment_method=payment_method,
            transaction_id=transaction_id,
            status='COMPLETED'
        )
        
        bill.status = 'PAID'
        bill.save()
        
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
    except Bill.DoesNotExist:
        return Response({'error': 'Bill not found'}, status=status.HTTP_404_NOT_FOUND)
