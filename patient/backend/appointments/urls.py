from django.urls import path
from .views import AppointmentCreateView, AppointmentListView, AppointmentDetailView, cancel_appointment

urlpatterns = [
    path('create/', AppointmentCreateView.as_view(), name='appointment-create'),
    path('list/', AppointmentListView.as_view(), name='appointment-list'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    path('<int:pk>/cancel/', cancel_appointment, name='appointment-cancel'),
]
