# EduTools - Gestión y Sandbox Pedagógico 🎓

EduTools es una plataforma web diseñada para optimizar el flujo de trabajo entre los equipos de Asesoría Pedagógica y Maquetación en entornos de educación a distancia (Canvas LMS).

## 1. Situación Problemática
Se ha detectado una brecha crítica en el montaje de aulas virtuales:
* **Dispersión de la Información:** Instructivos y manuales fragmentados.
* **Dependencia Técnica:** Los asesores no pueden previsualizar contenidos con estilos institucionales antes de la maquetación.
* **Iteraciones Ineficientes:** El 30% de los tickets sufren demoras por desajustes técnicos o estéticos.

## 2. Solución Propuesta
EduTools centraliza recursos y ofrece un **Sandbox de Diseño** que emula la hoja de estilos institucional. Esto permite generar un "output" HTML limpio, asegurando la coherencia visual desde la fase de diseño y optimizando el traspaso al equipo técnico.

---

## 3. Equipo DEV6

| Integrante | Rol | Responsabilidad |
|-----------|-----|----------------|
| Jonathan Guillén | PM / BA / Dev Full Stack | Liderazgo técnico, Product Discovery, gestión del repositorio |
| Ale Corva | Developer | Arquitectura Angular, routing, servicios y vistas |
| Gonzalo Velasco | Developer | Modelado de datos (DER), endpoints CRUD y script SQL |
| Daniela Salvo | Developer | Vistas frontend, Sandbox y documentación |
| Gerardo Romero | Developer | Componentes compartidos, formularios y vista About |

---

## 4. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular **21.x** (Signals + Standalone Components) |
| Backend | Django **6.0.4** + Django REST Framework |
| Base de datos | MySQL |
| Estilos | Bootstrap **5.3** |

---

## 5. Especificación de Requerimientos (Sprint 1 — refinados)

### Requerimientos Funcionales (RF)
* **RF1:** El sistema debe permitir a los usuarios iniciar sesión mediante un formulario con credenciales, validando los campos antes del envío.
* **RF2:** El sistema debe mostrar un panel interactivo (Dashboard) con los estándares institucionales (videos, lecturas, actividades, acordeones e infografías), obtenidos desde el servicio API.
* **RF3:** El sistema debe permitir cargar nuevos recursos pedagógicos a través de un formulario reactivo con validaciones de campos requeridos, longitud mínima y formato.
* **RF4:** El sistema debe listar las plantillas disponibles en la vista Home como tarjetas, mostrando nombre y categoría sin hardcoding en el HTML.
* **RF5:** El sistema debe mostrar la identidad, misión y propósito del equipo en la sección "Quiénes Somos" (About).

### Requerimientos No Funcionales (RNF)
* **RNF1 - Persistencia e Integridad:** El sistema garantiza la persistencia de datos en MySQL, con restricciones de integridad referencial (Foreign Keys) en los modelos Usuario, Categoría, Asignatura y Recurso.
* **RNF2 - Desempeño y Usabilidad:** La interfaz es responsive (Bootstrap 5, desde 320px hasta 4K) con tiempos de carga inferiores a 2 segundos bajo condiciones normales de red.
* **RNF3 - Arquitectura e Integración:** Arquitectura desacoplada: SPA Angular ↔ API REST Django, con CORS configurado y estructura modular en `pages/`, `components/` y `services/`.

---

## 6. Instrucciones de Instalación y Ejecución

### Backend (Django)

```bash
cd Backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

Crear el archivo `.env` basándose en `.env_modelo` con las credenciales MySQL locales:

```
DB_NAME=edutools_db
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_HOST=localhost
DB_PORT=3306
```

```bash
python manage.py migrate
python manage.py runserver
# API disponible en: http://127.0.0.1:8000/api/
```

### Frontend (Angular)

```bash
cd Frontend
npm install
ng serve
# Aplicación en: http://localhost:4200
```

> El frontend se conecta al backend en `http://127.0.0.1:8000/api/`. Asegurarse de tener el backend corriendo antes de iniciar el frontend.

---

## 7. Estructura del Proyecto

```
ModPWeb--Dev6/
├── Backend/
│   ├── api/
│   │   ├── models.py        # Usuario, Categoría, Asignatura, Recurso
│   │   ├── serializers.py   # Serializadores DRF
│   │   ├── views.py         # ViewSets CRUD
│   │   └── urls.py          # Rutas API
│   ├── core/
│   │   └── settings.py      # Configuración MySQL, CORS, timezone ARG
│   └── .env_modelo          # Modelo de variables de entorno
├── Frontend/
│   └── src/app/
│       ├── components/      # Header y Footer compartidos
│       ├── pages/           # Home, About, Dashboard, Login
│       └── services/        # ApiService (HttpClient + RxJS)
└── docs/
    ├── der.md               # Diagrama Entidad-Relación
    └── sql/                 # Script de creación de BD
```

---

## 8. Documentación

* [Wiki del Proyecto](https://github.com/ISPC-TSDWAD/ModPWeb--Dev6/wiki)
* [Diagrama Entidad-Relación](docs/der.md)
* [Script SQL](docs/sql/script_database.sql)

---

## 📸 Evidencias de Funcionamiento

### Conexión Exitosa con el Backend
![Backend API](docs/capturas/Test%20conection%20-%20backend.png)

### Integración Frontend y Consola
![Frontend Console](docs/capturas/Test%20conection%20-%20frontend.png)