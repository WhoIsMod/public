from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medicaldocument',
            name='file',
            field=models.FileField(blank=True, null=True, upload_to='medical_documents/'),
        ),
    ]
