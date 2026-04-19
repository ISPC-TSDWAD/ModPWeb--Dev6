from django.db import models

class TestConexion(models.Model):
    mensaje = models.CharField(max_length=100)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.mensaje