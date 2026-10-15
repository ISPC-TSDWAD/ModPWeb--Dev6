from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    """
    - Admins (is_staff) pueden listar, crear, editar y eliminar cualquier usuario.
    - Usuarios normales solo pueden ver, editar o eliminar su propio perfil.
      No pueden consultar los datos de otra persona ni listar a todos.
    - Usuarios normales no pueden crear usuarios nuevos.
    """

    def has_permission(self, request, view):
        accion = getattr(view, 'action', '')
        # Acciones sobre el propio usuario: cualquier autenticado.
        if accion in ('me', 'change_password'):
            return request.user and request.user.is_authenticated
        # Solo administradores pueden crear usuarios (POST)
        if request.method == 'POST':
            return request.user and request.user.is_staff
        # Solo administradores pueden listar a todos
        if accion == 'list':
            return request.user and request.user.is_staff
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Los administradores pueden hacer cualquier cosa con cualquier objeto
        if request.user and request.user.is_staff:
            return True
            
        # Un usuario comun solo accede a su propio perfil, tambien para leerlo:
        # los datos de otra persona (correo, nombre, rol) no se consultan.
        return obj == request.user
