from django.contrib.auth.models import AbstractUser
from django.db import models


# ──────────────────────────────────────────────
# Modelo de Usuario (extiende AbstractUser)
# ──────────────────────────────────────────────
class Usuario(AbstractUser):
    """
    Modelo de usuario personalizado que agrega un campo de rol.
    Roles disponibles: Administrador, Asesor Pedagógico, Maquetador.
    """

    class Rol(models.TextChoices):
        ADMINISTRADOR = 'admin', 'Administrador'
        ASESOR = 'asesor', 'Asesor Pedagógico'
        MAQUETADOR = 'maquetador', 'Maquetador'

    rol = models.CharField(
        max_length=20,
        choices=Rol.choices,
        default=Rol.ASESOR,
        verbose_name='Rol del usuario'
    )

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.username} ({self.get_rol_display()})"


# ──────────────────────────────────────────────
# Modelo de Categoría
# ──────────────────────────────────────────────
class Categoria(models.Model):
    """
    Categoría principal para clasificar componentes pedagógicos.
    Ejemplos del prototipo: Llamados a la Acción (CTA),
    Estándares de Diseño, Recursos Multimedia, etc.
    """

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


# ──────────────────────────────────────────────
# Modelo de Asignatura
# ──────────────────────────────────────────────
class Asignatura(models.Model):
    """
    Asignaturas o materias académicas para clasificar los recursos
    por área de conocimiento.
    Ejemplos: Matemáticas Avanzadas, Historia Universal,
    Química Orgánica, Programación III.
    """

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


# ──────────────────────────────────────────────
# Modelo de Recurso
# ──────────────────────────────────────────────
class Recurso(models.Model):
    """
    Recurso pedagógico creado desde el Sandbox.
    Pertenece a una Categoría, está asociado a una Asignatura
    y es creado por un Usuario.
    """

    class TipoRecurso(models.TextChoices):
        VIDEO = 'video', 'Video CTA'
        ACORDEON = 'acordeon', 'Acordeón'
        INFOGRAFIA = 'infografia', 'Infografía'
        CUESTIONARIO = 'cuestionario', 'Cuestionario'
        LECTURA = 'lectura', 'Lectura'
        ACTIVIDAD = 'actividad', 'Actividad'

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, default='')
    tipo = models.CharField(
        max_length=20,
        choices=TipoRecurso.choices,
        default=TipoRecurso.VIDEO,
        verbose_name='Tipo de recurso'
    )
    contenido = models.TextField(
        blank=True,
        default='',
        help_text='Contenido HTML o texto del recurso'
    )
    url = models.URLField(
        blank=True,
        default='',
        help_text='Enlace de destino del recurso'
    )

    # ── Foreign Keys ──
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name='recursos',
        verbose_name='Categoría principal'
    )
    asignatura = models.ForeignKey(
        Asignatura,
        on_delete=models.PROTECT,
        related_name='recursos',
        verbose_name='Asignatura de destino'
    )
    creado_por = models.ForeignKey(
        'Usuario',
        on_delete=models.CASCADE,
        related_name='recursos',
        verbose_name='Creado por'
    )

    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Recurso'
        verbose_name_plural = 'Recursos'
        ordering = ['-creado_en']

    def __str__(self):
        return f"{self.titulo} ({self.get_tipo_display()})"