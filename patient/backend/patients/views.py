from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .models import Patient
from .serializers import PatientRegistrationSerializer, PatientSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def staff_login(request):
    """Staff login: username + password. Requires is_staff=True. Uses username (not OMANG)."""
    username = (request.data.get('username') or '').strip()
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Patient uses omang as USERNAME_FIELD; staff use username for login
    user = None
    try:
        user = Patient.objects.get(username=username)
        if not user.check_password(password):
            user = None
    except Patient.DoesNotExist:
        pass
    if user and getattr(user, 'is_staff', False):
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'staff': PatientSerializer(user).data,
            'patient': PatientSerializer(user).data,
            'is_staff': True
        })
    if user:
        return Response({'error': 'Access denied. Staff account required.'}, status=status.HTTP_403_FORBIDDEN)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class PatientRegistrationView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PatientRegistrationSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def patient_login(request):
    omang = (request.data.get('omang') or '').strip()
    password = request.data.get('password')

    if not omang or not password:
        return Response({'error': 'OMANG and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    from core.hashing import hash_value

    # Try plain OMANG first, then hashed (supports both storage formats)
    patient = None
    try:
        patient = Patient.objects.get(omang=omang)
    except Patient.DoesNotExist:
        try:
            patient = Patient.objects.get(omang=hash_value(omang))
        except Patient.DoesNotExist:
            pass

    if patient:
        if patient.check_password(password):
            refresh = RefreshToken.for_user(patient)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'patient': PatientSerializer(patient).data
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
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
