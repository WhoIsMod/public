from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import MedicalStaff
from .serializers import MedicalStaffSerializer

class MedicalStaffListView(generics.ListAPIView):
    queryset = MedicalStaff.objects.filter(is_available=True)
    serializer_class = MedicalStaffSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'specialty', 'department']
    filterset_fields = ['specialty', 'department', 'is_available']
    ordering_fields = ['name', 'specialty']

class MedicalStaffDetailView(generics.RetrieveAPIView):
    queryset = MedicalStaff.objects.all()
    serializer_class = MedicalStaffSerializer
    permission_classes = [permissions.IsAuthenticated]
