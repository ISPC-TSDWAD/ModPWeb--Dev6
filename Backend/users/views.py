from rest_framework import viewsets, permissions
from .models import Usuario
from .serializers import UsuarioSerializer
from .permissions import IsAdminOrOwner

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminOrOwner]
