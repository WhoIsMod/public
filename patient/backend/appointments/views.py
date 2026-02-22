from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from patients.models import Patient
from .models import Appointment
from .serializers import AppointmentSerializer


def _appointments_queryset(user):
    """Staff: all appointments. Patient: own appointments."""
    if getattr(user, 'is_staff', False):
        return Appointment.objects.all()
    return Appointment.objects.filter(patient=user)


class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        patient_id = self.request.data.get('patient')
        if getattr(self.request.user, 'is_staff', False) and patient_id:
            patient = Patient.objects.get(pk=patient_id)
            serializer.save(patient=patient)
        else:
            serializer.save(patient=self.request.user)

class AppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return _appointments_queryset(self.request.user).order_by('-appointment_date')

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return _appointments_queryset(self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_appointment(request, pk):
    queryset = _appointments_queryset(request.user)
    try:
        appointment = queryset.get(pk=pk)
        appointment.status = 'CANCELLED'
        appointment.save()
        return Response({'message': 'Appointment cancelled successfully'}, status=status.HTTP_200_OK)
    except (Appointment.DoesNotExist, ValueError):
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
