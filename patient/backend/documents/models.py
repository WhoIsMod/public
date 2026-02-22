from django.db import models
from patients.models import Patient
from core.storage import medical_document_upload_to


class MedicalDocument(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ('LAB_REPORT', 'Lab Report'),
        ('X_RAY', 'X-Ray'),
        ('MRI', 'MRI'),
        ('CT_SCAN', 'CT Scan'),
        ('ULTRASOUND', 'Ultrasound'),
        ('PRESCRIPTION', 'Prescription'),
        ('DISCHARGE_SUMMARY', 'Discharge Summary'),
        ('MEDICAL_CERTIFICATE', 'Medical Certificate'),
        ('INSURANCE_FORM', 'Insurance Form'),
        ('OTHER', 'Other'),
    ]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=30, choices=DOCUMENT_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to=medical_document_upload_to, blank=True, null=True)
    file_size = models.IntegerField(blank=True, null=True)
    mime_type = models.CharField(max_length=100, blank=True, null=True)
    uploaded_by = models.CharField(max_length=200, blank=True, null=True)
    date_issued = models.DateField(blank=True, null=True)
    is_encrypted = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medical_documents'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.patient.first_name} {self.patient.last_name}"
