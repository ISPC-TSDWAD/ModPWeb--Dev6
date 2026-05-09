from rest_framework import viewsets
from .models import Usuario, Categoria, Asignatura, Recurso
from .serializers import (
    UsuarioSerializer,
    CategoriaSerializer,
    AsignaturaSerializer,
    RecursoSerializer,
)


class UsuarioViewSet(viewsets.ModelViewSet):
    """CRUD completo para usuarios del sistema."""
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class CategoriaViewSet(viewsets.ModelViewSet):
    """CRUD completo para categorías de componentes."""
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class AsignaturaViewSet(viewsets.ModelViewSet):
    """CRUD completo para asignaturas académicas."""
    queryset = Asignatura.objects.all()
    serializer_class = AsignaturaSerializer


class RecursoViewSet(viewsets.ModelViewSet):
    """CRUD completo para recursos pedagógicos."""
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer