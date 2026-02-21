from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.conf import settings
from .models import Patient


def _decrypt_if_needed(val):
    if not getattr(settings, 'USE_HASHED_STORAGE', False) or not val:
        return val
    if isinstance(val, str) and val.startswith('gAAAAA'):
        from core.hashing import decrypt_value
        return decrypt_value(val)
    return val


class PatientRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Patient
        fields = ('id', 'username', 'email', 'password', 'password2', 'first_name', 'last_name',
                  'omang', 'cellphone', 'medical_aid', 'medical_aid_number', 'next_of_kin_name',
                  'next_of_kin_contact', 'location', 'address')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        patient = Patient.objects.create(**validated_data)
        patient.set_password(password)
        patient.save()
        return patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'omang', 'cellphone',
                  'medical_aid', 'medical_aid_number', 'next_of_kin_name', 'next_of_kin_contact',
                  'location', 'address', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if getattr(settings, 'USE_HASHED_STORAGE', False):
            data['omang'] = '********' if len(instance.omang or '') == 64 else (instance.omang or '')
            for key in ['email', 'cellphone', 'medical_aid', 'medical_aid_number', 'next_of_kin_name',
                        'next_of_kin_contact', 'location', 'address']:
                data[key] = _decrypt_if_needed(data.get(key))
        return data
