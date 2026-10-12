# Deploy del backend en PythonAnywhere (HTTPS)

Backend: `ModPWeb--Dev6/Backend` (Django 6 + DRF + SimpleJWT).
Resultado esperado: `https://<USUARIO>.pythonanywhere.com` (HTTPS incluido, sin configurar certificados).

## 0. Verificar antes de empezar (2 minutos)

1. **Python 3.12 o superior.** Django 6 lo exige. En PythonAnywhere: *Account → System image*. Debe ser **innit** (trae 3.12 y 3.13; la imagen *haggis* llega solo hasta 3.10 y **no sirve**).
2. **¿Hay MySQL gratis en tu cuenta?** PythonAnywhere ofrece MySQL gratuito solo a cuentas creadas **antes del 15/01/2026**. Mirá la pestaña **Databases**:
   - Si aparece MySQL → seguí con la opción A.
   - Si no aparece (cuenta nueva gratuita) → opción B (SQLite) o pasar a un plan pago.

| Opción | Cuándo | Qué cambia |
|---|---|---|
| **A. MySQL** | Cuenta con MySQL | `DB_ENGINE=mysql` (por defecto) y datos `DB_*` |
| **B. SQLite** | Cuenta gratuita nueva | `DB_ENGINE=sqlite` y listo. Los datos quedan en un archivo del servidor. Suficiente para la entrega; avisar al docente que el motor del hosting es SQLite. |

## 1. Subir el código

> Importante: el código de seguridad (settings, seed, README) está en la rama `feature/jonathan-guillen-sprint2`. Hay que **pushearla** antes, o el servidor no la va a encontrar.

En PythonAnywhere → **Consoles → Bash**:

```bash
cd ~
git clone https://github.com/ISPC-TSDWAD/ModPWeb--Dev6.git
cd ModPWeb--Dev6
git checkout feature/jonathan-guillen-sprint2     # cambiar a main cuando se mergee el PR
```

## 2. Entorno virtual y dependencias

```bash
ls /usr/bin/python3*                               # confirmar que existe python3.12 o 3.13
mkvirtualenv edutools-env --python=/usr/bin/python3.13
cd ~/ModPWeb--Dev6/Backend
pip install -r requirements.txt
```

`mysqlclient` se instala sin problemas en PythonAnywhere (ya trae las librerías de MySQL).

## 3. Base de datos

### Opción A — MySQL
1. Pestaña **Databases** → definir la contraseña de MySQL (guardala en un gestor de claves).
2. Crear una base, por ejemplo `edutools`. El nombre completo queda `<USUARIO>$edutools`.
3. Anotar el **Database host address** (formato `<USUARIO>.mysql.pythonanywhere-services.com`).

### Opción B — SQLite
No se crea nada. Solo poner `DB_ENGINE=sqlite` en el paso siguiente.

## 4. Variables de entorno (archivo `.env` en el servidor)

`settings.py` lee `Backend/.env`. Ese archivo **no está en Git** (está en `.gitignore`), se crea solo en el servidor:

```bash
cd ~/ModPWeb--Dev6/Backend
python -c "from django.core.management.utils import get_random_secret_key as g; print(g())"   # copiar el resultado
nano .env
```

Contenido (reemplazar lo que está entre `<>`):

```ini
SECRET_KEY=<la clave generada arriba>
DEBUG=False
ALLOWED_HOSTS=<USUARIO>.pythonanywhere.com
CSRF_TRUSTED_ORIGINS=https://<USUARIO>.pythonanywhere.com
# La app Android no usa CORS. Si hay un front web, poner su URL https exacta:
CORS_ALLOWED_ORIGINS=

# --- Opción A (MySQL) ---
DB_ENGINE=mysql
DB_NAME=<USUARIO>$edutools
DB_USER=<USUARIO>
DB_PASSWORD=<contraseña de MySQL>
DB_HOST=<USUARIO>.mysql.pythonanywhere-services.com
DB_PORT=3306

# --- Opción B (SQLite): reemplazar el bloque anterior por esta línea ---
# DB_ENGINE=sqlite
```

Proteger el archivo y verificar que no se versiona:

```bash
chmod 600 .env
git status            # .env NO debe aparecer
```

## 5. Migraciones, estáticos y datos de prueba

```bash
cd ~/ModPWeb--Dev6/Backend
python manage.py migrate
python manage.py collectstatic --noinput
python seed_pedagogia.py            # categorías y asignaturas (no crea usuarios)
```

> ⛔ **No ejecutar `reset_db.py` en el servidor**: borra la base de datos completa (`DROP DATABASE`).

## 6. Superusuario seguro (antes de pasar la URL a nadie)

El repo ya no trae credenciales. Crear un administrador **nuevo**, con nombre distinto de `admin` y clave fuerte (mínimo 14 caracteres, no reutilizada):

```bash
python manage.py createsuperuser        # pide usuario, email y clave por teclado (no queda en ningún archivo)
python manage.py shell
```

Dentro del shell:

```python
from users.models import Usuario
# 1) Darle rol admin en la API (createsuperuser lo deja como 'asesor')
Usuario.objects.filter(username="<tu_superusuario>").update(rol="admin")
# 2) Si existiera el usuario de prueba viejo, desactivarlo
Usuario.objects.filter(username="admin").update(is_active=False)
# 3) Verificar
print(list(Usuario.objects.values("username", "is_superuser", "rol", "is_active")))
exit()
```

Con ese superusuario ya creado, cargar los recursos de ejemplo (usa ese usuario como autor, no necesita contraseña):

```bash
SEED_ADMIN_USERNAME=<tu_superusuario> python seed_mock_data.py
```

### Cuentas de prueba para el equipo (una por rol)

Claves aleatorias que se imprimen **una sola vez**; compartirlas por privado, nunca en el README ni en un Issue público:

```bash
python manage.py shell
```

```python
import secrets
from users.models import Usuario
for username, rol in [("asesor_demo", "asesor"), ("maquetador_demo", "maquetador")]:
    clave = secrets.token_urlsafe(12)
    u, creado = Usuario.objects.get_or_create(username=username, defaults={"rol": rol, "email": f"{username}@edutools.edu.ar"})
    u.rol = rol
    u.set_password(clave)
    u.save()
    print(username, rol, clave)
exit()
```

## 7. Crear la web app

1. Pestaña **Web → Add a new web app** → *Manual configuration* (**no** la opción "Django") → misma versión de Python que el virtualenv.
2. **Virtualenv**: escribir `edutools-env`.
3. **Source code / Working directory**: `/home/<USUARIO>/ModPWeb--Dev6/Backend`.
4. **WSGI configuration file** (link en la misma pestaña): borrar todo y pegar:

```python
import os
import sys

path = '/home/<USUARIO>/ModPWeb--Dev6/Backend'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

5. **Static files**: URL `/static/` → Directory `/home/<USUARIO>/ModPWeb--Dev6/Backend/staticfiles`.
6. Activar **Force HTTPS**.
7. Botón verde **Reload**.

## 8. Verificación (esto es lo que se prueba antes de pasar la URL)

```bash
BASE="https://<USUARIO>.pythonanywhere.com"

curl -i "$BASE/api/pedagogia/recursos/"          # esperado: 401 (pide token)
curl -s -X POST "$BASE/api/token/" -H "Content-Type: application/json" \
     -d '{"username":"asesor_demo","password":"<clave>"}'     # esperado: 200 con access/refresh/rol
curl -i -X POST "$BASE/api/token/" -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"<clave_vieja_de_prueba>"}'   # esperado: 401 (la cuenta vieja NO funciona)
curl -sI "$BASE/admin/login/" | head -1                        # esperado: 200
```

Si algo falla: pestaña **Web → Error log** (ahí aparece el traceback).
Errores típicos: `DisallowedHost` (falta la URL en `ALLOWED_HOSTS`), `ImproperlyConfigured: SECRET_KEY` (no se leyó el `.env`), `Access denied for user` (datos `DB_*` mal copiados).

## 9. Actualizar el servidor después de cada cambio

Sin reconfigurar nada:

```bash
cd ~/ModPWeb--Dev6 && git pull
workon edutools-env
cd Backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
touch /var/www/<USUARIO>_pythonanywhere_com_wsgi.py     # equivale a apretar Reload
```

## 10. Mantenimiento (cuenta gratuita)

- La web app gratuita **vence al mes**: entrar a la pestaña *Web* y apretar **"Run until 1 month from today"** antes de esa fecha, o la API se cae.
- Las conexiones MySQL inactivas se cierran a los 5 minutos; `settings.py` ya lo contempla (`CONN_MAX_AGE`).
