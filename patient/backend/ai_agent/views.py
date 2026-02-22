from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core.files.base import ContentFile
import PyPDF2
import docx
from .models import AIInterpretation
from .serializers import AIInterpretationSerializer
from .services import interpreter
from documents.models import MedicalDocument

def _interpretations_queryset(user):
    """Staff: all interpretations. Patient: own interpretations."""
    if getattr(user, 'is_staff', False):
        return AIInterpretation.objects.all()
    return AIInterpretation.objects.filter(patient=user)


class AIInterpretationListView(generics.ListAPIView):
    serializer_class = AIInterpretationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return _interpretations_queryset(self.request.user)

class AIInterpretationDetailView(generics.RetrieveAPIView):
    serializer_class = AIInterpretationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return _interpretations_queryset(self.request.user)

def _get_document_for_user(user, document_id):
    """Staff can access any document; patients only their own."""
    doc = MedicalDocument.objects.filter(pk=document_id)
    if getattr(user, 'is_staff', False):
        return doc.get()
    return doc.filter(patient=user).get()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def interpret_document(request, document_id):
    try:
        document = _get_document_for_user(request.user, document_id)
        
        text_content = ""
        if document.file:
            file_extension = document.file.name.split('.')[-1].lower()
            
            if file_extension == 'pdf':
                try:
                    pdf_reader = PyPDF2.PdfReader(document.file)
                    for page in pdf_reader.pages:
                        text_content += page.extract_text()
                except:
                    text_content = "Unable to extract text from PDF"
            elif file_extension in ['doc', 'docx']:
                try:
                    doc = docx.Document(document.file)
                    text_content = '\n'.join([para.text for para in doc.paragraphs])
                except:
                    text_content = "Unable to extract text from document"
            else:
                try:
                    document.file.seek(0)
                    text_content = document.file.read().decode('utf-8')
                except:
                    text_content = "Unable to read document content"
        
        if not text_content:
            return Response({'error': 'Could not extract text from document'}, status=status.HTTP_400_BAD_REQUEST)
        
        interpretation_data = interpreter.interpret_document(text_content)
        
        interpretation = AIInterpretation.objects.create(
            document=document,
            patient=document.patient,
            original_text=text_content[:1000],
            interpreted_text=interpretation_data['interpreted_text'],
            summary=interpretation_data['summary'],
            key_findings=interpretation_data['key_findings'],
            recommendations=interpretation_data['recommendations'],
            confidence_score=interpretation_data['confidence_score']
        )
        
        return Response(AIInterpretationSerializer(interpretation).data, status=status.HTTP_201_CREATED)
    except MedicalDocument.DoesNotExist:
        return Response({'error': 'Document not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
