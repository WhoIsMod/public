from django.urls import path
from .views import MedicalRecordCreateView, MedicalRecordListView, MedicalRecordDetailView

urlpatterns = [
    path('create/', MedicalRecordCreateView.as_view(), name='medical-record-create'),
    path('list/', MedicalRecordListView.as_view(), name='medical-record-list'),
    path('<int:pk>/', MedicalRecordDetailView.as_view(), name='medical-record-detail'),
]
