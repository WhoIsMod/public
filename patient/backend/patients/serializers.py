from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Patient

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
