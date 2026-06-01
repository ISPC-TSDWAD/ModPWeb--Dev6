from django.contrib.auth.models import AbstractUser
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
