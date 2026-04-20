from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TestConexionViewSet

router = DefaultRouter()
<<<<<<< HEAD
router.register(r'test-conexion', TestConexionViewSet)
=======
router.register(r'test', TestConexionViewSet)
>>>>>>> develop

urlpatterns = [
    path('', include(router.urls)),
]