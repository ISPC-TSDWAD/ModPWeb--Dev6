from django.db import models
from django.db.models import ProtectedError
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from .models import Categoria, Asignatura, Recurso
from .permissions import LecturaTodosEscrituraEquipo, es_del_equipo_de_contenido
from .serializers import CategoriaSerializer, AsignaturaSerializer, RecursoSerializer


class BorradoProtegidoMixin:
    """
    Las categorias y asignaturas estan protegidas (on_delete=PROTECT) para no
    perder los recursos que cuelgan de ellas. Sin esto, borrar una que esta en
    uso reventaba con un error 500; ahora devuelve 409 con un mensaje claro.
    """

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {'detail': 'No se puede borrar: todavia hay recursos que la usan.'},
                status=status.HTTP_409_CONFLICT,
            )


class CategoriaViewSet(BorradoProtegidoMixin, viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [LecturaTodosEscrituraEquipo]


class AsignaturaViewSet(BorradoProtegidoMixin, viewsets.ModelViewSet):
    queryset = Asignatura.objects.all()
    serializer_class = AsignaturaSerializer
    permission_classes = [LecturaTodosEscrituraEquipo]


class RecursoViewSet(viewsets.ModelViewSet):
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'rol', 'asesor') in ['admin', 'maquetador']:
            return Recurso.objects.all()
        # Asesores ven plantillas base y sus propias copias
        return Recurso.objects.filter(models.Q(es_plantilla_base=True) | models.Q(creado_por=user))

    def perform_create(self, serializer):
        user = self.request.user
        es_plantilla = getattr(user, 'rol', 'asesor') in ['admin', 'maquetador']
        serializer.save(creado_por=user, es_plantilla_base=es_plantilla)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if instance.es_plantilla_base and getattr(user, 'rol', '') == 'asesor':
            # En lugar de actualizar, creamos una copia personal para el asesor.
            # La copia conserva todo lo que el asesor edito (titulo, descripcion,
            # tipo, contenido, url, categoria y asignatura); lo que no mando se
            # hereda de la plantilla. Se valida igual que en el alta, asi que el
            # contenido con scripts tambien se rechaza aca. Los campos de solo
            # lectura (creado_por, es_plantilla_base, copia_de) los ignora el
            # serializer y los fijamos nosotros.
            serializer = self.get_serializer(data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            cambios = serializer.validated_data

            def valor(campo):
                return cambios[campo] if campo in cambios else getattr(instance, campo)

            titulo = cambios.get('titulo')
            if not titulo or titulo == instance.titulo:
                titulo = instance.titulo + " (Mi Copia)"

            nuevo_recurso = Recurso.objects.create(
                titulo=titulo,
                descripcion=valor('descripcion'),
                tipo=valor('tipo'),
                contenido=valor('contenido'),
                url=valor('url'),
                categoria=valor('categoria'),
                asignatura=valor('asignatura'),
                creado_por=user,
                es_plantilla_base=False,
                copia_de=instance
            )
            return Response(self.get_serializer(nuevo_recurso).data,
                            status=status.HTTP_201_CREATED)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if instance.es_plantilla_base and getattr(user, 'rol', '') == 'asesor':
            raise PermissionDenied("No tienes permiso para eliminar una plantilla base institucional.")
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='set-plantilla')
    def set_plantilla(self, request, pk=None):
        """
        Marca o desmarca un recurso como plantilla base institucional.
        Solo admin o maquetador, igual que set-role en usuarios (#18).
        """
        if not es_del_equipo_de_contenido(request.user):
            raise PermissionDenied('Solo un admin o un maquetador puede marcar plantillas.')

        recurso = self.get_object()
        valor = request.data.get('es_plantilla_base', True)
        if isinstance(valor, str):
            valor = valor.strip().lower() in ('1', 'true', 'si', 'sí', 'yes')
        recurso.es_plantilla_base = bool(valor)
        recurso.save(update_fields=['es_plantilla_base', 'actualizado_en'])
        return Response(self.get_serializer(recurso).data)
