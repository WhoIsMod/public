from rest_framework import generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from patients.models import Patient
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer


def _medical_records_queryset(user):
    """Staff: all records. Patient: own records."""
    if getattr(user, 'is_staff', False):
        return MedicalRecord.objects.all()
    return MedicalRecord.objects.filter(patient=user)


class MedicalRecordCreateView(generics.CreateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        patient_id = self.request.data.get('patient')
        if getattr(self.request.user, 'is_staff', False) and patient_id:
            patient = Patient.objects.get(pk=patient_id)
            serializer.save(patient=patient, recorded_by=self.request.user.get_full_name() or self.request.user.username)
        else:
            serializer.save(patient=self.request.user)

class MedicalRecordListView(generics.ListAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['record_id', 'chronic_illness', 'underlying_condition']
    filterset_fields = ['race', 'sex', 'chronic_illness']
    ordering_fields = ['created_at', 'heart_rate']
    
    def get_queryset(self):
        return _medical_records_queryset(self.request.user)

class MedicalRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return _medical_records_queryset(self.request.user)
