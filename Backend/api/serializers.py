from rest_framework import serializers
from .models import Usuario, Categoria, Asignatura, Recurso


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rol', 'is_active']
        read_only_fields = ['id']


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'


class AsignaturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignatura
        fields = '__all__'


class RecursoSerializer(serializers.ModelSerializer):
    # Campos de solo lectura para mostrar nombres en lugar de IDs
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    asignatura_nombre = serializers.CharField(source='asignatura.nombre', read_only=True)
    creado_por_nombre = serializers.CharField(source='creado_por.username', read_only=True)

    class Meta:
        model = Recurso
        fields = '__all__'