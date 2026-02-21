from rest_framework.response import Response
from rest_framework import status

def api_response(data=None, message="", status_code=status.HTTP_200_OK, errors=None):
    """
    Standardizes the API response format across the application.
    """
    response_data = {
        "success": 200 <= status_code < 300,
        "message": message,
        "data": data,
    }
    if errors:
        response_data["errors"] = errors
        
    return Response(response_data, status=status_code)
