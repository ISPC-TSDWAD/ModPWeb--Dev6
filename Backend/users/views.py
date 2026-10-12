import logging

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import APIException, PermissionDenied
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Usuario
from .permissions import IsAdminOrOwner
from .security_log import registrar
from .serializers import (
    CambioRolSerializer,
    CustomTokenObtainPairSerializer,
    UsuarioSerializer,
)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        # Solo se registra el nombre de usuario: la contraseña NUNCA se loguea.
        username = request.data.get('username', '') if hasattr(request.data, 'get') else ''
        try:
            response = super().post(request, *args, **kwargs)
        except APIException as exc:
            registrar(request, 'LOGIN_FAILED', request.path,
                      f'fallido ({exc.status_code})', usuario=username or 'anonimo',
                      nivel=logging.WARNING)
            raise
        registrar(request, 'LOGIN', request.path, 'exitoso', usuario=username)
        return response


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminOrOwner]

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        """Datos del usuario autenticado. GET para leer, PATCH para editar perfil."""
        user = request.user
        if request.method == 'PATCH':
            # Solo permitimos editar campos de perfil (no rol ni is_staff).
            permitidos = {'first_name', 'last_name', 'email'}
            data = {k: v for k, v in request.data.items() if k in permitidos}
            serializer = self.get_serializer(user, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        """Cambio de contraseña del propio usuario (valida la actual)."""
        user = request.user
        actual = request.data.get('actual') or ''
        nueva = request.data.get('nueva') or ''
        if not user.check_password(actual):
            registrar(request, 'PASSWORD_CHANGE', request.path,
                      'fallido: contraseña actual incorrecta', nivel=logging.WARNING)
            return Response(
                {'detail': 'La contraseña actual es incorrecta.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(nueva) < 6:
            return Response(
                {'detail': 'La nueva contraseña debe tener al menos 6 caracteres.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(nueva)
        user.save()
        registrar(request, 'PASSWORD_CHANGE', request.path, 'exitoso')
        return Response({'detail': 'Contraseña actualizada correctamente.'})

    @action(detail=True, methods=['post'], url_path='set-role')
    def set_role(self, request, pk=None):
        """
        Cambia el rol de un usuario. Solo administradores (lo exige IsAdminOrOwner
        para todo POST). Es el ÚNICO camino de la API para cambiar rol / is_staff.
        Un rol 'admin' implica is_staff=True; los otros roles, is_staff=False.
        """
        objetivo = self.get_object()
        serializer = CambioRolSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        nuevo = serializer.validated_data['rol']

        if objetivo.is_superuser:
            raise PermissionDenied('No se puede cambiar el rol de un superusuario desde la API.')
        if objetivo == request.user and nuevo != Usuario.Rol.ADMINISTRADOR:
            return Response(
                {'detail': 'No podés quitarte a vos mismo el rol de administrador.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        anterior = objetivo.rol
        objetivo.rol = nuevo
        objetivo.is_staff = (nuevo == Usuario.Rol.ADMINISTRADOR)
        objetivo.save(update_fields=['rol', 'is_staff'])
        registrar(request, 'ROLE_CHANGE', f'usuario:{objetivo.username}',
                  f'exitoso: {anterior} -> {nuevo}', nivel=logging.WARNING)
        return Response(UsuarioSerializer(objetivo).data)
