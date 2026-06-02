from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    """
    - Admins (is_staff) pueden listar, crear, editar y eliminar cualquier usuario.
    - Usuarios normales solo pueden ver la lista, y editar/eliminar su propio perfil.
    - Usuarios normales no pueden crear usuarios nuevos.
    """

    def has_permission(self, request, view):
        # Solo administradores pueden crear usuarios (POST)
        if request.method == 'POST':
            return request.user and request.user.is_staff
        # Para listar o ver, cualquier autenticado pasa (el filtro de object entra después)
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Los administradores pueden hacer cualquier cosa con cualquier objeto
        if request.user and request.user.is_staff:
            return True
            
        # Los métodos seguros (GET, HEAD, OPTIONS) están permitidos para todos (ver perfiles)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Para modificar o eliminar (PUT, PATCH, DELETE), el usuario debe ser el mismo objeto
        return obj == request.user
