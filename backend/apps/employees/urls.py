from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet, ViewSelfEmployeeView

router = DefaultRouter()
router.register(r'', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('me/', ViewSelfEmployeeView.as_view(), name='employee-me'),
    path('', include(router.urls)),
]
