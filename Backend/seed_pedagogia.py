import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from pedagogia.models import Categoria, Asignatura

# Seed Categorías
Categoria.objects.get_or_create(nombre='CTA', descripcion='Call to Action')
Categoria.objects.get_or_create(nombre='ORGANIZADOR', descripcion='Organizadores de contenido')
Categoria.objects.get_or_create(nombre='RESALTADO', descripcion='Textos resaltados')

# Seed Asignaturas
Asignatura.objects.get_or_create(nombre='Matematicas', descripcion='Asignatura de Matemáticas')
Asignatura.objects.get_or_create(nombre='Historia', descripcion='Asignatura de Historia')
Asignatura.objects.get_or_create(nombre='Psicologia', descripcion='Asignatura de Psicología')
Asignatura.objects.get_or_create(nombre='Todas', descripcion='Para uso general')

print("Base de datos poblada con Categorías y Asignaturas de prueba.")
