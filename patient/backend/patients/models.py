from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.conf import settings


class Patient(AbstractUser):
    # omang: when USE_HASHED_STORAGE, stores HMAC-SHA256 hash (64 chars); else plain OMANG
    omang = models.CharField(max_length=64, unique=True, validators=[RegexValidator(regex=r'^[\da-fA-F]{9,64}$', message='OMANG must be 9+ digits or hash')])
    cellphone = models.CharField(max_length=255, validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message='Invalid phone number')])
    medical_aid = models.CharField(max_length=255, blank=True, null=True)
    medical_aid_number = models.CharField(max_length=255, blank=True, null=True)
    next_of_kin_name = models.CharField(max_length=255)
    next_of_kin_contact = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'omang'
    REQUIRED_FIELDS = ['username', 'email', 'cellphone', 'next_of_kin_name', 'next_of_kin_contact', 'location', 'address']

    class Meta:
        db_table = 'patients'
        verbose_name = 'Patient'
        verbose_name_plural = 'Patients'

    def save(self, *args, **kwargs):
        from core.hashing import hash_value, encrypt_value

        if getattr(settings, 'USE_HASHED_STORAGE', False):
            # Hash OMANG for lookup (store hash in omang)
            if self.omang and len(self.omang) <= 20 and self.omang.isdigit():
                self.omang = hash_value(self.omang)
            # Encrypt other PII
            for field in ['email', 'cellphone', 'medical_aid', 'medical_aid_number', 'next_of_kin_name',
                          'next_of_kin_contact', 'location', 'address']:
                val = getattr(self, field)
                if val and not (isinstance(val, str) and val.startswith('gAAAAA')):  # not already encrypted
                    enc = encrypt_value(val)
                    if enc:
                        setattr(self, field, enc)
        super().save(*args, **kwargs)

    def _decrypt_field(self, val):
        from core.hashing import decrypt_value
        if val and isinstance(val, str) and val.startswith('gAAAAA'):
            return decrypt_value(val)
        return val

    @property
    def cellphone_display(self):
        return self._decrypt_field(self.cellphone) or self.cellphone

    @property
    def address_display(self):
        return self._decrypt_field(self.address) or self.address

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.omang[:8]}...)" if len(self.omang or '') > 8 else f"{self.first_name} {self.last_name} ({self.omang})"
