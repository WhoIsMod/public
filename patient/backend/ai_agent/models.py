from django.db import models
from patients.models import Patient
from documents.models import MedicalDocument

class AIInterpretation(models.Model):
    document = models.ForeignKey(MedicalDocument, on_delete=models.CASCADE, related_name='interpretations')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='ai_interpretations')
    original_text = models.TextField()
    interpreted_text = models.TextField()
    summary = models.TextField()
    key_findings = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    model_version = models.CharField(max_length=50, default='llama-2-7b')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_interpretations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"AI Interpretation for {self.document.title}"
