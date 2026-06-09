from rest_framework import serializers
from .models import Categoria, Asignatura, Recurso

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion', 'activa', 'creado_en', 'actualizado_en']

class AsignaturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignatura
        fields = ['id', 'nombre', 'descripcion', 'activa', 'creado_en', 'actualizado_en']

class RecursoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    asignatura_nombre = serializers.ReadOnlyField(source='asignatura.nombre')

    class Meta:
        model = Recurso
        fields = [
            'id', 'titulo', 'descripcion', 'tipo', 'contenido', 'url',
            'categoria', 'asignatura', 'categoria_nombre', 'asignatura_nombre',
            'creado_por', 'es_plantilla_base', 'copia_de', 'activo',
            'creado_en', 'actualizado_en',
        ]
        read_only_fields = ['creado_por']
