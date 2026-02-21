from django.db import models
from patients.models import Patient
from staff.models import MedicalStaff

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    staff = models.ForeignKey(MedicalStaff, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateTimeField()
    duration_minutes = models.IntegerField(default=30)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointments'
        ordering = ['appointment_date']
    
    def __str__(self):
        return f"Appointment: {self.patient.first_name} with {self.staff.name} on {self.appointment_date}"
