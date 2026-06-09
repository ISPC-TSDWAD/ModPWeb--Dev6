from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, ContactAPIView

router = DefaultRouter()
router.register(r'', UsuarioViewSet)

urlpatterns = [
    path('contact/', ContactAPIView.as_view(), name='contact'),
    path('', include(router.urls)),
]
