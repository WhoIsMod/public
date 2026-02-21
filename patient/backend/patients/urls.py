from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import PatientRegistrationView, patient_login, PatientProfileView, PatientListView

urlpatterns = [
    path('register/', PatientRegistrationView.as_view(), name='patient-register'),
    path('login/', patient_login, name='patient-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', PatientProfileView.as_view(), name='patient-profile'),
    path('list/', PatientListView.as_view(), name='patient-list'),
]
