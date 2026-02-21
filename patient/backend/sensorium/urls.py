from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('patients.urls')),
    path('api/patients/', include('patients.urls')),
    path('api/medical/', include('medical_records.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/staff/', include('staff.urls')),
    path('api/pharmacy/', include('pharmacy.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/documents/', include('documents.urls')),
    path('api/ai/', include('ai_agent.urls')),
    path('api/hospital/', include('hospital_navigation.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
