from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentCreateView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)

class AppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user).order_by('-appointment_date')

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_appointment(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk, patient=request.user)
        appointment.status = 'CANCELLED'
        appointment.save()
        return Response({'message': 'Appointment cancelled successfully'}, status=status.HTTP_200_OK)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
