from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestConexionViewSet

router = DefaultRouter()
router.register(r'test', TestConexionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]