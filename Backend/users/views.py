from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Usuario
from .serializers import UsuarioSerializer, CustomTokenObtainPairSerializer
from .permissions import IsAdminOrOwner
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

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
        return Response({'detail': 'Contraseña actualizada correctamente.'})

