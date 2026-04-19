from rest_framework import viewsets
from .models import TestConexion
from .serializers import TestConexionSerializer

class TestConexionViewSet(viewsets.ModelViewSet):
    queryset = TestConexion.objects.all()
    serializer_class = TestConexionSerializer