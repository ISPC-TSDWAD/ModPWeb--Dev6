from rest_framework import serializers
from .models import Categoria, Asignatura, Recurso

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class AsignaturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignatura
        fields = '__all__'

class RecursoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    asignatura_nombre = serializers.ReadOnlyField(source='asignatura.nombre')

    class Meta:
        model = Recurso
        fields = '__all__'
        read_only_fields = ['creado_por']
