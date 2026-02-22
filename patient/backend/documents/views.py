from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import FileResponse
from patients.models import Patient
from .models import MedicalDocument
from .serializers import MedicalDocumentSerializer


def _documents_queryset(user):
    """Staff: all documents. Patient: own documents."""
    if getattr(user, 'is_staff', False):
        return MedicalDocument.objects.all()
    return MedicalDocument.objects.filter(patient=user)


class MedicalDocumentCreateView(generics.CreateAPIView):
    queryset = MedicalDocument.objects.all()
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def     perform_create(self, serializer):
        file = self.request.FILES.get('file')
        patient_id = self.request.data.get('patient')
        patient = self.request.user
        if getattr(self.request.user, 'is_staff', False) and patient_id:
            patient = Patient.objects.get(pk=patient_id)
        if file:
            serializer.save(
                patient=patient,
                file_size=file.size,
                mime_type=file.content_type
            )
        else:
            serializer.save(patient=patient)

class MedicalDocumentListView(generics.ListAPIView):
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return _documents_queryset(self.request.user)

class MedicalDocumentDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return _documents_queryset(self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_document(request, pk):
    queryset = _documents_queryset(request.user)
    try:
        document = queryset.get(pk=pk)
        return FileResponse(document.file.open(), as_attachment=True, filename=document.file.name)
    except (MedicalDocument.DoesNotExist, ValueError):
        return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
