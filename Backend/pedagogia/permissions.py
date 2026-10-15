from rest_framework import permissions

ROLES_DE_CONTENIDO = ('admin', 'maquetador')


class LecturaTodosEscrituraEquipo(permissions.BasePermission):
    """
    Catalogos (categorias y asignaturas): los puede leer cualquier usuario
    autenticado, pero solo admin y maquetador los pueden crear, editar o borrar.
    Antes cualquier asesor podia borrar una categoria entera.
    """

    message = 'Solo un admin o un maquetador puede modificar los catalogos.'

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return es_del_equipo_de_contenido(request.user)


def es_del_equipo_de_contenido(user):
    """True si el usuario puede administrar contenido institucional."""
    if getattr(user, 'is_staff', False):
        return True
    return getattr(user, 'rol', '') in ROLES_DE_CONTENIDO
