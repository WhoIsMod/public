from django.urls import path
from .views import MedicationListView, MedicationDetailView, PrescriptionListView, OrderCreateView, OrderListView

urlpatterns = [
    path('medications/', MedicationListView.as_view(), name='medication-list'),
    path('medications/<int:pk>/', MedicationDetailView.as_view(), name='medication-detail'),
    path('prescriptions/', PrescriptionListView.as_view(), name='prescription-list'),
    path('orders/create/', OrderCreateView.as_view(), name='order-create'),
    path('orders/', OrderListView.as_view(), name='order-list'),
]
