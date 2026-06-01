import os
import shutil
import subprocess

backend_dir = r"c:\Users\Johny\ModPWeb--Dev6\Backend"
manage_py = os.path.join(backend_dir, "manage.py")

python_exe = os.path.join(backend_dir, "venv", "Scripts", "python.exe")

# 1. Create new apps manually to avoid circular dependencies in settings
os.makedirs(os.path.join(backend_dir, "users"), exist_ok=True)
os.makedirs(os.path.join(backend_dir, "pedagogia"), exist_ok=True)

with open(os.path.join(backend_dir, "users", "__init__.py"), "w") as f: f.write("")
with open(os.path.join(backend_dir, "pedagogia", "__init__.py"), "w") as f: f.write("")

with open(os.path.join(backend_dir, "users", "apps.py"), "w") as f:
    f.write("from django.apps import AppConfig\n\nclass UsersConfig(AppConfig):\n    default_auto_field = 'django.db.models.BigAutoField'\n    name = 'users'\n")

with open(os.path.join(backend_dir, "pedagogia", "apps.py"), "w") as f:
    f.write("from django.apps import AppConfig\n\nclass PedagogiaConfig(AppConfig):\n    default_auto_field = 'django.db.models.BigAutoField'\n    name = 'pedagogia'\n")

# 2. Write users/models.py
users_models = """from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    class Rol(models.TextChoices):
        ADMINISTRADOR = 'admin', 'Administrador'
        ASESOR = 'asesor', 'Asesor Pedagógico'
        MAQUETADOR = 'maquetador', 'Maquetador'

    rol = models.CharField(max_length=20, choices=Rol.choices, default=Rol.ASESOR, verbose_name='Rol del usuario')

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.username} ({self.get_rol_display()})"
"""
with open(os.path.join(backend_dir, "users", "models.py"), "w", encoding="utf-8") as f:
    f.write(users_models)

# 3. Write pedagogia/models.py
pedagogia_models = """from django.db import models
from users.models import Usuario

class Categoria(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, default='')
    activa = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Asignatura(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, default='')
    activa = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Asignatura'
        verbose_name_plural = 'Asignaturas'
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Recurso(models.Model):
    class TipoRecurso(models.TextChoices):
        VIDEO = 'video', 'Video CTA'
        ACORDEON = 'acordeon', 'Acordeón'
        INFOGRAFIA = 'infografia', 'Infografía'
        CUESTIONARIO = 'cuestionario', 'Cuestionario'
        LECTURA = 'lectura', 'Lectura'
        ACTIVIDAD = 'actividad', 'Actividad'

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, default='')
    tipo = models.CharField(max_length=20, choices=TipoRecurso.choices, default=TipoRecurso.VIDEO)
    contenido = models.TextField(blank=True, default='')
    url = models.URLField(blank=True, default='')

    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name='recursos')
    asignatura = models.ForeignKey(Asignatura, on_delete=models.PROTECT, related_name='recursos')
    creado_por = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='recursos')

    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Recurso'
        verbose_name_plural = 'Recursos'
        ordering = ['-creado_en']

    def __str__(self):
        return f"{self.titulo} ({self.get_tipo_display()})"
"""
with open(os.path.join(backend_dir, "pedagogia", "models.py"), "w", encoding="utf-8") as f:
    f.write(pedagogia_models)

# 4. Write serializers and views for pedagogia
with open(os.path.join(backend_dir, "pedagogia", "serializers.py"), "w", encoding="utf-8") as f:
    f.write("from rest_framework import serializers\nfrom .models import Categoria, Asignatura, Recurso\n\nclass CategoriaSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Categoria\n        fields = '__all__'\n\nclass AsignaturaSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Asignatura\n        fields = '__all__'\n\nclass RecursoSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Recurso\n        fields = '__all__'\n")

with open(os.path.join(backend_dir, "pedagogia", "views.py"), "w", encoding="utf-8") as f:
    f.write("from rest_framework import viewsets\nfrom .models import Categoria, Asignatura, Recurso\nfrom .serializers import CategoriaSerializer, AsignaturaSerializer, RecursoSerializer\n\nclass CategoriaViewSet(viewsets.ModelViewSet):\n    queryset = Categoria.objects.all()\n    serializer_class = CategoriaSerializer\n\nclass AsignaturaViewSet(viewsets.ModelViewSet):\n    queryset = Asignatura.objects.all()\n    serializer_class = AsignaturaSerializer\n\nclass RecursoViewSet(viewsets.ModelViewSet):\n    queryset = Recurso.objects.all()\n    serializer_class = RecursoSerializer\n")

with open(os.path.join(backend_dir, "pedagogia", "urls.py"), "w", encoding="utf-8") as f:
    f.write("from django.urls import path, include\nfrom rest_framework.routers import DefaultRouter\nfrom .views import CategoriaViewSet, AsignaturaViewSet, RecursoViewSet\n\nrouter = DefaultRouter()\nrouter.register(r'categorias', CategoriaViewSet)\nrouter.register(r'asignaturas', AsignaturaViewSet)\nrouter.register(r'recursos', RecursoViewSet)\n\nurlpatterns = [\n    path('', include(router.urls)),\n]\n")

# 5. Write serializers, views and urls for users
with open(os.path.join(backend_dir, "users", "serializers.py"), "w", encoding="utf-8") as f:
    f.write("from rest_framework import serializers\nfrom .models import Usuario\n\nclass UsuarioSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = Usuario\n        fields = '__all__'\n")

with open(os.path.join(backend_dir, "users", "views.py"), "w", encoding="utf-8") as f:
    f.write("from rest_framework import viewsets\nfrom .models import Usuario\nfrom .serializers import UsuarioSerializer\n\nclass UsuarioViewSet(viewsets.ModelViewSet):\n    queryset = Usuario.objects.all()\n    serializer_class = UsuarioSerializer\n")

with open(os.path.join(backend_dir, "users", "urls.py"), "w", encoding="utf-8") as f:
    f.write("from django.urls import path, include\nfrom rest_framework.routers import DefaultRouter\nfrom .views import UsuarioViewSet\n\nrouter = DefaultRouter()\nrouter.register(r'', UsuarioViewSet)\n\nurlpatterns = [\n    path('', include(router.urls)),\n]\n")

# 6. Delete old api app
api_dir = os.path.join(backend_dir, "api")
if os.path.exists(api_dir):
    shutil.rmtree(api_dir)

print("Backend refactored successfully.")
