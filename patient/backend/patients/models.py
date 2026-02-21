from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class Patient(AbstractUser):
    omang = models.CharField(max_length=20, unique=True, validators=[RegexValidator(regex=r'^\d+$', message='OMANG must be numeric')])
    cellphone = models.CharField(max_length=15, validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message='Invalid phone number')])
    medical_aid = models.CharField(max_length=100, blank=True, null=True)
    medical_aid_number = models.CharField(max_length=50, blank=True, null=True)
    next_of_kin_name = models.CharField(max_length=200)
    next_of_kin_contact = models.CharField(max_length=15)
    location = models.CharField(max_length=200)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'omang'
    REQUIRED_FIELDS = ['username', 'email', 'cellphone', 'next_of_kin_name', 'next_of_kin_contact', 'location', 'address']
    
    class Meta:
        db_table = 'patients'
        verbose_name = 'Patient'
        verbose_name_plural = 'Patients'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.omang})"
