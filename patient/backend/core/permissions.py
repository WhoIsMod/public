"""Reusable permission classes."""
from rest_framework.permissions import BasePermission


class IsStaffUser(BasePermission):
    """Allow access only for staff users (Patient with is_staff=True)."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, 'is_staff', False)
        )
