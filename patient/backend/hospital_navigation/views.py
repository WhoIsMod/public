from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import requests

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_hospital_navigation(request):
    department = request.query_params.get('department', '')
    
    navigation_data = {
        'departments': [
            {'id': 1, 'name': 'Emergency', 'floor': 'Ground', 'directions': 'Main entrance, turn left'},
            {'id': 2, 'name': 'Cardiology', 'floor': '2nd Floor', 'directions': 'Elevator A, turn right'},
            {'id': 3, 'name': 'Radiology', 'floor': '1st Floor', 'directions': 'Main entrance, straight ahead'},
            {'id': 4, 'name': 'Pharmacy', 'floor': 'Ground', 'directions': 'Main entrance, turn right'},
            {'id': 5, 'name': 'Laboratory', 'floor': '1st Floor', 'directions': 'Elevator B, turn left'},
        ],
        'api_handoff': {
            'endpoint': 'https://api.hospital.com/navigation',
            'method': 'POST',
            'headers': {'Authorization': 'Bearer YOUR_API_KEY'},
        }
    }
    
    if department:
        filtered = [d for d in navigation_data['departments'] if department.lower() in d['name'].lower()]
        navigation_data['departments'] = filtered
    
    return Response(navigation_data)
