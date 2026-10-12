from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Usuario


def rol_efectivo(user):
    """Rol que se informa al cliente: un superusuario siempre es 'admin'."""
    return 'admin' if user.is_superuser else getattr(user, 'rol', 'asesor')


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'password', 'rol']
        # Corrección #18 (escalada de privilegios): estos campos se pueden LEER pero
        # nunca ESCRIBIR desde este serializer. Si el cliente los manda en un
        # PATCH/PUT/POST, DRF los ignora. El rol solo cambia por la acción
        # admin-only `set-role` (queda registrada en el log de seguridad).
        read_only_fields = ['is_staff', 'is_active', 'rol']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def create(self, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data and validated_data['password'].strip():
            validated_data['password'] = make_password(validated_data['password'])
        else:
            validated_data.pop('password', None)
        return super().update(instance, validated_data)


class CambioRolSerializer(serializers.Serializer):
    """Entrada de POST /api/users/<id>/set-role/ (solo administradores)."""
    rol = serializers.ChoiceField(choices=Usuario.Rol.choices)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Corrección #19: claims reales DENTRO del JWT (firmados), no solo en el
        # cuerpo de la respuesta. Así el cliente puede leer rol/is_staff del token
        # y el servidor puede confiar en ellos porque van firmados con la SECRET_KEY.
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        token['rol'] = rol_efectivo(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Se mantienen también en el cuerpo para no romper a quien ya los lee de ahí.
        data['is_staff'] = self.user.is_staff
        data['rol'] = rol_efectivo(self.user)
        return data
