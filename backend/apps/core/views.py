from django.http import JsonResponse

def api_root_view(request):
    """
    Root view for the API to avoid 404 on the base URL.
    """
    return JsonResponse({
        "status": "Online",
        "system": "Fine-Grained Permission System",
        "version": "1.1.0",
        "message": "The Authority Engine is operational. Please use the documented API endpoints or the frontend application.",
        "documentation": "/API_DOCUMENTATION.md (local path)",
        "timestamp": "2026-02-23"
    })
