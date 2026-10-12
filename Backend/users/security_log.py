"""
Log de seguridad.

Cada línea queda así:
    fecha-hora | nivel | user | ip | action | resource | result

Se guarda: usuario, IP, qué hizo, a qué ruta y cómo terminó.
No se guarda nunca: contraseñas ni tokens.
"""
import logging

logger = logging.getLogger('security')


def _limpio(valor, largo=120):
    """Saca saltos de línea y recorta, para que nadie pueda inventar líneas en el log."""
    texto = str(valor if valor not in (None, '') else '-')
    texto = texto.replace('\r', ' ').replace('\n', ' ').replace('|', '/')
    return texto[:largo]


def ip_cliente(request):
    """IP del cliente. En PythonAnywhere viene en X-Forwarded-For."""
    if request is None:
        return '-'
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '-')


def registrar(request, accion, recurso, resultado, usuario=None, nivel=logging.INFO):
    """Escribe una línea en el log. `usuario` puede ser un texto o un User."""
    if usuario is None and request is not None:
        usuario = getattr(request, 'user', None)
    if hasattr(usuario, 'is_authenticated'):
        usuario = usuario.get_username() if usuario.is_authenticated else 'anonimo'
    logger.log(
        nivel,
        'user=%s | ip=%s | action=%s | resource=%s | result=%s',
        _limpio(usuario or 'anonimo'),
        _limpio(ip_cliente(request)),
        _limpio(accion),
        _limpio(recurso, 200),
        _limpio(resultado),
    )
