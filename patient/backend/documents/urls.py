from django.urls import path
from .views import MedicalDocumentCreateView, MedicalDocumentListView, MedicalDocumentDetailView, download_document

urlpatterns = [
    path('upload/', MedicalDocumentCreateView.as_view(), name='document-upload'),
    path('list/', MedicalDocumentListView.as_view(), name='document-list'),
    path('<int:pk>/', MedicalDocumentDetailView.as_view(), name='document-detail'),
    path('<int:pk>/download/', download_document, name='document-download'),
]
