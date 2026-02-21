from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import FileResponse
from .models import MedicalDocument
from .serializers import MedicalDocumentSerializer

class MedicalDocumentCreateView(generics.CreateAPIView):
    queryset = MedicalDocument.objects.all()
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        if file:
            serializer.save(
                patient=self.request.user,
                file_size=file.size,
                mime_type=file.content_type
            )
        else:
            serializer.save(patient=self.request.user)

class MedicalDocumentListView(generics.ListAPIView):
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MedicalDocument.objects.filter(patient=self.request.user)

class MedicalDocumentDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return MedicalDocument.objects.filter(patient=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_document(request, pk):
    try:
        document = MedicalDocument.objects.get(pk=pk, patient=request.user)
        return FileResponse(document.file.open(), as_attachment=True, filename=document.file.name)
    except MedicalDocument.DoesNotExist:
        return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
