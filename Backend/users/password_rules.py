"""
Regla de contrasena robusta de EduTools (politica PSM-01 de la Wiki).

Es la misma que aplica la app Android en Validador.mensajePassword: mas de 8
caracteres, con al menos una letra, un numero y un caracter especial. Se repite
aca porque la app no es una barrera: quien llame a la API directo se la salta.
"""

LARGO_MINIMO = 9   # "mas de 8 caracteres"


def mensaje_password(password):
    """Dice en espanol que le falta a la contrasena. Devuelve None si esta bien."""
    if not isinstance(password, str) or len(password) < LARGO_MINIMO:
        return 'La contraseña tiene que tener más de 8 caracteres.'
    hay_letra = any(c.isalpha() for c in password)
    hay_numero = any(c.isdigit() for c in password)
    hay_especial = any(not c.isalnum() and not c.isspace() for c in password)
    if not hay_letra:
        return 'Agregá al menos una letra.'
    if not hay_numero:
        return 'Agregá al menos un número.'
    if not hay_especial:
        return 'Agregá al menos un carácter especial (por ejemplo ! # $ %).'
    return None
