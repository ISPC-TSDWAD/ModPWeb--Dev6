from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Categoria, Asignatura, Recurso


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    """Admin para el modelo de Usuario personalizado con rol."""
    list_display = ('username', 'email', 'first_name', 'last_name', 'rol', 'is_active')
    list_filter = ('rol', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name')

    # Agregamos el campo 'rol' al formulario de edición de usuario
    fieldsets = UserAdmin.fieldsets + (
        ('Rol del Sistema', {'fields': ('rol',)}),
    )
    # Agregamos el campo 'rol' al formulario de creación de usuario
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Rol del Sistema', {'fields': ('rol',)}),
    )


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    """Admin para gestionar categorías de componentes."""
    list_display = ('id', 'nombre', 'activa', 'creado_en')
    list_filter = ('activa',)
    search_fields = ('nombre',)


@admin.register(Asignatura)
class AsignaturaAdmin(admin.ModelAdmin):
    """Admin para gestionar asignaturas académicas."""
    list_display = ('id', 'nombre', 'activa', 'creado_en')
    list_filter = ('activa',)
    search_fields = ('nombre',)


@admin.register(Recurso)
class RecursoAdmin(admin.ModelAdmin):
    """Admin para gestionar recursos pedagógicos."""
    list_display = ('id', 'titulo', 'tipo', 'categoria', 'asignatura', 'creado_por', 'activo', 'creado_en')
    list_filter = ('tipo', 'categoria', 'asignatura', 'activo')
    search_fields = ('titulo', 'descripcion')
    raw_id_fields = ('creado_por',)