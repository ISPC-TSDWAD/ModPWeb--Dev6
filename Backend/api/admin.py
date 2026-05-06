from django.contrib import admin
from .models import TestConexion

@admin.register(TestConexion)
class TestConexionAdmin(admin.ModelAdmin):
    # Mostramos los campos exactos que definiste en tu modelo
    list_display = ('id', 'mensaje', 'creado_en')
    # Metemos un buscador por si la tabla crece
    search_fields = ('mensaje',)