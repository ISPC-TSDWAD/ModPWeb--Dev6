from pathlib import Path
import os
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Cargo el .env con la ruta completa. En el servidor load_dotenv() sin ruta no lo encontraba.
load_dotenv(BASE_DIR / '.env')

# DEBUG sale del .env (por defecto False = seguro). Poné DEBUG=True solo en local.
DEBUG = os.getenv('DEBUG', 'False').strip().lower() in ('1', 'true', 'yes')

# La SECRET_KEY NUNCA va en el código: se lee de una variable de entorno.
# Si falta y no estamos en DEBUG, el servidor se niega a arrancar (falla rápido).
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = 'dev-only-insecure-key-no-usar-en-produccion'
    else:
        from django.core.exceptions import ImproperlyConfigured
        raise ImproperlyConfigured('Falta la variable de entorno SECRET_KEY.')

# Hosts permitidos separados por coma en el .env. En local cae a localhost.
ALLOWED_HOSTS = [h.strip() for h in os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',') if h.strip()]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Librerías para que funcione el intercambio con Angular
    'corsheaders', 
    'rest_framework',
    'users',
    'pedagogia',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # <--- SIEMPRE PRIMERO O SEGUNDO
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware', # <--- CorsMiddleware debe estar ARRIBA de este
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database - MySQL (por defecto).
# Alternativa para hostings sin MySQL gratuito: DB_ENGINE=sqlite en el entorno.
if os.getenv('DB_ENGINE', 'mysql').strip().lower() == 'sqlite':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME'),
            'USER': os.getenv('DB_USER'),
            'PASSWORD':  os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', '127.0.0.1'),
            'PORT': os.getenv('DB_PORT', '3306'),
            # Los hostings cierran conexiones inactivas (PythonAnywhere: 5 min).
            'CONN_MAX_AGE': 280,
            'CONN_HEALTH_CHECKS': True,
            'OPTIONS': {'charset': 'utf8mb4'},
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'es-ar'
TIME_ZONE = 'America/Argentina/Cordoba'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
# Carpeta destino de `python manage.py collectstatic` (la sirve el hosting).
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Modelo de usuario personalizado
AUTH_USER_MODEL = 'users.Usuario'

# CONFIGURACIÓN DE CORS (cerrado: nunca se permite "todo el mundo")
# Lista explícita en CORS_ALLOWED_ORIGINS del entorno (separada por coma).
# Si está vacía, solo se permite el Angular de desarrollo local.
# La app Android nativa no usa CORS (no es un navegador).
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [o.strip() for o in os.getenv('CORS_ALLOWED_ORIGINS', '').split(',') if o.strip()] or [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
]

# Orígenes https de confianza para formularios con CSRF (login del /admin/).
CSRF_TRUSTED_ORIGINS = [o.strip() for o in os.getenv('CSRF_TRUSTED_ORIGINS', '').split(',') if o.strip()]

# ENDURECIMIENTO PARA PRODUCCIÓN (solo cuando DEBUG=False)
if not DEBUG:
    # El hosting termina el HTTPS en su proxy y nos avisa con este header.
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_CONTENT_TYPE_NOSNIFF = True

# CONFIGURACIÓN DE REST FRAMEWORK Y JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    # Anota en el log los accesos denegados (401/403).
    'EXCEPTION_HANDLER': 'core.exceptions.security_exception_handler',
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Logs de seguridad: se guardan en Backend/logs/security.log
# (con la variable LOG_DIR se puede cambiar la carpeta).
# Ahí no van contraseñas ni tokens (ver users/security_log.py).
LOG_DIR = Path(os.getenv('LOG_DIR') or (BASE_DIR / 'logs'))
LOG_DIR.mkdir(parents=True, exist_ok=True)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'security': {
            'format': '%(asctime)s | %(levelname)s | %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S%z',
        },
    },
    'handlers': {
        'security_file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': str(LOG_DIR / 'security.log'),
            'maxBytes': 1_000_000,
            'backupCount': 5,
            'encoding': 'utf-8',
            'formatter': 'security',
        },
    },
    'loggers': {
        'security': {
            'handlers': ['security_file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}
