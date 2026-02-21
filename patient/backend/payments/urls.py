from django.urls import path
from .views import BillListView, BillDetailView, PaymentCreateView, PaymentListView, process_payment

urlpatterns = [
    path('bills/', BillListView.as_view(), name='bill-list'),
    path('bills/<int:pk>/', BillDetailView.as_view(), name='bill-detail'),
    path('create/', PaymentCreateView.as_view(), name='payment-create'),
    path('list/', PaymentListView.as_view(), name='payment-list'),
    path('process/<int:bill_id>/', process_payment, name='process-payment'),
]
