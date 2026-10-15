from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Usuario
from .password_rules import mensaje_password


def rol_efectivo(user):
    """Si es superusuario devuelve 'admin', si no devuelve su rol."""
    return 'admin' if user.is_superuser else getattr(user, 'rol', 'asesor')


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'password', 'rol']
        # Issue #18: estos campos se pueden ver pero no cambiar desde acá.
        # Si llegan en un PATCH/PUT/POST, DRF los ignora.
        # El rol se cambia con la acción set-role (solo admin).
        read_only_fields = ['is_staff', 'is_active', 'rol']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def validate_password(self, valor):
        # Vale para el alta y para la edicion: la API tambien exige la regla robusta.
        falta = mensaje_password(valor)
        if falta:
            raise serializers.ValidationError(falta)
        return valor

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
    """Dato que recibe set-role (solo admin)."""
    rol = serializers.ChoiceField(choices=Usuario.Rol.choices)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Issue #19: agrego rol e is_staff adentro del token.
        # Van firmados, si alguien los toca el token deja de servir.
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        token['rol'] = rol_efectivo(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Los dejo también en la respuesta para no romper lo que ya los usa.
        data['is_staff'] = self.user.is_staff
        data['rol'] = rol_efectivo(self.user)
        return data
