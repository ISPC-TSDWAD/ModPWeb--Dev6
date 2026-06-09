from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.db import models
from .models import Categoria, Asignatura, Recurso
from .serializers import CategoriaSerializer, AsignaturaSerializer, RecursoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [permissions.IsAuthenticated]

class AsignaturaViewSet(viewsets.ModelViewSet):
    queryset = Asignatura.objects.all()
    serializer_class = AsignaturaSerializer
    permission_classes = [permissions.IsAuthenticated]

class RecursoViewSet(viewsets.ModelViewSet):
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'rol', 'admin') in ['admin', 'maquetador']:
            return Recurso.objects.all()
        # Asesores ven plantillas base y sus propias copias
        return Recurso.objects.filter(models.Q(es_plantilla_base=True) | models.Q(creado_por=user))

    def perform_create(self, serializer):
        user = self.request.user
        es_plantilla = getattr(user, 'rol', 'admin') in ['admin', 'maquetador']
        serializer.save(creado_por=user, es_plantilla_base=es_plantilla)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if instance.es_plantilla_base and getattr(user, 'rol', '') == 'asesor':
            # En lugar de actualizar, creamos una copia personal para el asesor
            nuevo_recurso = Recurso.objects.create(
                titulo=instance.titulo + " (Mi Copia)",
                descripcion=instance.descripcion,
                tipo=instance.tipo,
                contenido=request.data.get('contenido', instance.contenido),
                url=instance.url,
                categoria=instance.categoria,
                asignatura=instance.asignatura,
                creado_por=user,
                es_plantilla_base=False,
                copia_de=instance
            )
            serializer = self.get_serializer(nuevo_recurso)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if instance.es_plantilla_base and getattr(user, 'rol', '') == 'asesor':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("No tienes permiso para eliminar una plantilla base institucional.")
        return super().destroy(request, *args, **kwargs)
