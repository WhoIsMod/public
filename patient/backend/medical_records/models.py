from django.db import models
from patients.models import Patient

class MedicalRecord(models.Model):
    RACE_CHOICES = [
        ('AFRICAN', 'African'),
        ('CAUCASIAN', 'Caucasian'),
        ('ASIAN', 'Asian'),
        ('MIXED', 'Mixed'),
        ('OTHER', 'Other'),
    ]
    
    SEX_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='medical_records')
    record_id = models.CharField(max_length=50, unique=True)
    heart_rate = models.IntegerField(null=True, blank=True)
    underlying_condition = models.TextField(blank=True, null=True)
    chronic_illness = models.CharField(max_length=200, blank=True, null=True)
    features = models.TextField(blank=True, null=True)
    race = models.CharField(max_length=20, choices=RACE_CHOICES, blank=True, null=True)
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, blank=True, null=True)
    blood_pressure_systolic = models.IntegerField(null=True, blank=True)
    blood_pressure_diastolic = models.IntegerField(null=True, blank=True)
    temperature = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    recorded_by = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medical_records'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Record {self.record_id} - {self.patient.first_name} {self.patient.last_name}"
