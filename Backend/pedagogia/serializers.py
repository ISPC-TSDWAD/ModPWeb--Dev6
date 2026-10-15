import re

from rest_framework import serializers
from .models import Categoria, Asignatura, Recurso

# Lo que no puede venir dentro del HTML de un recurso: scripts, enlaces que
# ejecutan codigo y atributos tipo onclick. Si entra, despues se ejecuta en el
# navegador de otro usuario (XSS almacenado). Politica PSM-07 de la Wiki.
PATRONES_PELIGROSOS = (
    re.compile(r'<\s*script', re.IGNORECASE),
    re.compile(r'<\s*iframe', re.IGNORECASE),
    re.compile(r'javascript\s*:', re.IGNORECASE),
    re.compile(r'\son\w+\s*=', re.IGNORECASE),
)


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
        # Campos que marcan de quien es el recurso y si es plantilla institucional.
        # Van de solo lectura: si no, cualquiera se asciende la copia a plantilla
        # mandando un PATCH, que es el mismo problema que corregimos en #18.
        # Un admin o un maquetador los cambia por POST recursos/{id}/set-plantilla/.
        read_only_fields = ['creado_por', 'es_plantilla_base', 'copia_de']

    def validate_contenido(self, valor):
        if not valor:
            return valor
        for patron in PATRONES_PELIGROSOS:
            if patron.search(valor):
                raise serializers.ValidationError(
                    'El contenido no puede traer scripts ni atributos de evento.'
                )
        return valor
