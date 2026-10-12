import logging

from rest_framework.views import exception_handler
from rest_framework_simplejwt.views import TokenObtainPairView

from users.security_log import registrar


def security_exception_handler(exc, context):
    """
    Igual que el manejador por defecto de DRF, pero además deja registro de los
    accesos denegados: 401 (sin token / token inválido) y 403 (sin permiso).
    El login fallido se registra aparte, en CustomTokenObtainPairView.
    """
    response = exception_handler(exc, context)
    request = context.get('request')
    view = context.get('view')

    if response is None or request is None or isinstance(view, TokenObtainPairView):
        return response

    if response.status_code == 401:
        registrar(request, 'ACCESS_DENIED', f'{request.method} {request.path}',
                  'denegado: no autenticado o token inválido', nivel=logging.WARNING)
    elif response.status_code == 403:
        registrar(request, 'ACCESS_DENIED', f'{request.method} {request.path}',
                  'denegado: permisos insuficientes', nivel=logging.WARNING)
    return response
