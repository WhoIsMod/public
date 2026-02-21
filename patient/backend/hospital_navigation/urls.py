from django.urls import path
from .views import get_hospital_navigation

urlpatterns = [
    path('', get_hospital_navigation, name='hospital-navigation'),
]
