from django.db import models

class MedicalStaff(models.Model):
    SPECIALTY_CHOICES = [
        ('CARDIOLOGY', 'Cardiology'),
        ('DERMATOLOGY', 'Dermatology'),
        ('ENDOCRINOLOGY', 'Endocrinology'),
        ('GASTROENTEROLOGY', 'Gastroenterology'),
        ('NEUROLOGY', 'Neurology'),
        ('ONCOLOGY', 'Oncology'),
        ('ORTHOPEDICS', 'Orthopedics'),
        ('PEDIATRICS', 'Pediatrics'),
        ('PSYCHIATRY', 'Psychiatry'),
        ('RADIOLOGY', 'Radiology'),
        ('SURGERY', 'Surgery'),
        ('GENERAL', 'General Practice'),
    ]
    
    name = models.CharField(max_length=200)
    specialty = models.CharField(max_length=50, choices=SPECIALTY_CHOICES)
    qualification = models.CharField(max_length=200)
    license_number = models.CharField(max_length=50, unique=True)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    department = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)
    availability_hours = models.JSONField(default=dict)
    is_available = models.BooleanField(default=True)
    profile_image = models.ImageField(upload_to='staff_profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medical_staff'
        verbose_name_plural = 'Medical Staff'
    
    def __str__(self):
        return f"{self.name} - {self.specialty}"
