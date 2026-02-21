from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Patient
from .serializers import PatientRegistrationSerializer, PatientSerializer

class PatientRegistrationView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PatientRegistrationSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def patient_login(request):
    omang = request.data.get('omang')
    password = request.data.get('password')
    
    if not omang or not password:
        return Response({'error': 'OMANG and password are required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        patient = Patient.objects.get(omang=omang)
        if patient.check_password(password):
            refresh = RefreshToken.for_user(patient)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'patient': PatientSerializer(patient).data
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Patient.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)

class PatientProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class PatientListView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
