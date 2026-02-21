# Generated migration for hashed storage support

from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='omang',
            field=models.CharField(max_length=64, unique=True, validators=[django.core.validators.RegexValidator(message='OMANG must be 9+ digits or hash', regex='^[\\da-fA-F]{9,64}$')]),
        ),
        migrations.AlterField(
            model_name='patient',
            name='cellphone',
            field=models.CharField(max_length=255, validators=[django.core.validators.RegexValidator(message='Invalid phone number', regex='^\\+?1?\\d{9,15}$')]),
        ),
        migrations.AlterField(
            model_name='patient',
            name='medical_aid',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='patient',
            name='medical_aid_number',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='patient',
            name='next_of_kin_name',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='patient',
            name='next_of_kin_contact',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='patient',
            name='location',
            field=models.CharField(max_length=255),
        ),
    ]
