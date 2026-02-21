from django.urls import path
from .views import AIInterpretationListView, AIInterpretationDetailView, interpret_document

urlpatterns = [
    path('interpretations/', AIInterpretationListView.as_view(), name='ai-interpretation-list'),
    path('interpretations/<int:pk>/', AIInterpretationDetailView.as_view(), name='ai-interpretation-detail'),
    path('interpret/<int:document_id>/', interpret_document, name='interpret-document'),
]
