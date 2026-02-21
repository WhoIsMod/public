from django.urls import path
from .views import MedicalStaffListView, MedicalStaffDetailView

urlpatterns = [
    path('list/', MedicalStaffListView.as_view(), name='staff-list'),
    path('<int:pk>/', MedicalStaffDetailView.as_view(), name='staff-detail'),
]
