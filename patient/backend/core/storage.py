"""
Centralized file storage paths for the app.
All uploads go under MEDIA_ROOT with organized subdirs for documents, bookings, staff, etc.
"""
from django.utils import timezone


def medical_document_upload_to(instance, filename):
    """e.g. medical_documents/2025/02/22/report_abc.pdf"""
    d = timezone.now()
    return f"medical_documents/{d.year}/{d.month:02d}/{d.day:02d}/{filename}"


def staff_profile_upload_to(instance, filename):
    """e.g. staff_profiles/staff_<id>_<filename>"""
    ext = filename.split(".")[-1] if "." in filename else "jpg"
    return f"staff_profiles/staff_{instance.id or 'new'}.{ext}"


def medication_image_upload_to(instance, filename):
    """e.g. medications/med_<id>_<filename>"""
    ext = filename.split(".")[-1] if "." in filename else "jpg"
    return f"medications/med_{instance.id or 'new'}.{ext}"
