from django.db import models
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
