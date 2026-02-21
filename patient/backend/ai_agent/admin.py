from django.contrib import admin
from .models import AIInterpretation

@admin.register(AIInterpretation)
class AIInterpretationAdmin(admin.ModelAdmin):
    list_display = ('document', 'patient', 'confidence_score', 'model_version', 'created_at')
    list_filter = ('model_version', 'created_at')
    search_fields = ('document__title', 'patient__first_name', 'patient__last_name')
