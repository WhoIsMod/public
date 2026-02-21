from rest_framework import generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer

class MedicalRecordCreateView(generics.CreateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)

class MedicalRecordListView(generics.ListAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['record_id', 'chronic_illness', 'underlying_condition']
    filterset_fields = ['race', 'sex', 'chronic_illness']
    ordering_fields = ['created_at', 'heart_rate']
    
    def get_queryset(self):
        return MedicalRecord.objects.filter(patient=self.request.user)

class MedicalRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MedicalRecord.objects.filter(patient=self.request.user)
