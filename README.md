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
| Jonathan Guillén | Líder Técnico / Dev Full Stack | Gestión del repositorio, Flujo Gitflow (Main/Develop), Arquitectura Base |
| Ale Corva | Developer | Desarrollo de servicios Angular, Lógica de Sandbox |
| Gonzalo Velasco | Developer | Modelado de datos (DER), Backend y Endpoints REST |
| Daniela Salvo | Developer | Maquetación de vistas, Componentes pedagógicos |
| Gerardo Romero | Developer | Integración de formularios y validaciones reactivas |

---

## 4. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | **Angular 17** (Standalone Components + Control Flow) |
| Backend | Django REST Framework |
| Base de datos | MySQL |
| Estilos | **Bootstrap 5.3** (npm) + **Tailwind CSS CDN** con Design Tokens institucionales |

---

## 5. Gestión del Proyecto y Metodología (GitHub Projects)
Se utiliza **GitHub Projects** para la gestión de Sprints y backlog:
*   **Sprint 0 (Evidencia 1):** Bases de datos y API inicial.
*   **Sprint 1 (Evidencia 2):** Sandbox, exportación y consolidación de UI.
*   **Tablero de Gestión:** [Acceso Directo al Proyecto](https://github.com/orgs/ISPC-TSDWAD/projects/4/views/5)


---

## 6. Documentación Oficial y Técnica

| Documento | Descripción | Enlace Directo |
|-----------|-------------|----------------|
| Documentación Formal Ev2 | Memoria técnica y estratégica del Sprint 1. | [Ver Documento](docs/EduTools_Documentacion_formal_Ev2.md) |
| Documento Técnico Sprint 2 | Arquitectura, endpoints y evidencias del Sprint 2 (APA). | [Ver PDF](docs/Documento_Tecnico_Sprint_2.pdf) |
| Poster de Defensa | Poster institucional del proyecto EduTools. | [Ver Poster](docs/posterEduTools.pdf) |
| DER - Notacion Chen | Diagrama E-R con entidades, atributos y relaciones. | [Ver DER Chen](docs/der_chen.md) |
| Modelo Relacional | Tablas fisicas MySQL con tipos, PK, FK y validacion cruzada con Django. | [Ver Modelo Relacional](docs/modelo_relacional.md) |
| Diagrama de Clases | Diagrama UML de clases del sistema. | [Ver Diagrama](docs/diagrama_clases.md) |
| Historias de Usuario | Sprint Backlog HU-01 a HU-08, criterios Gherkin (BDD). | [Ver HU](docs/historias_de_usuario.md) |
| Script SQL DDL | Codigo DDL MySQL ejecutable con datos iniciales. | [Ver Script](docs/sql/script_database.sql) |
| Wiki del Proyecto | Base de conocimientos, ceremonias y gestion agil. | [Ir a la Wiki](https://github.com/ISPC-TSDWAD/ModPWeb--Dev6/wiki) |



---

## 7. Especificación de Requerimientos (Sprint 1)

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

**Credenciales de prueba (Superusuario Django):**
- **Usuario:** `admin` o **Correo:** `admin@edutools.edu.ar`
- **Contraseña:** `Admin1234!`

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
│   ├── core/
│   │   ├── settings.py      # Configuracion MySQL, CORS, JWT, timezone ARG
│   │   └── urls.py          # Rutas principales (api/token/, api/users/, api/pedagogia/)
│   ├── users/
│   │   ├── models.py        # Modelo Usuario (AbstractUser + roles)
│   │   ├── serializers.py   # UsuarioSerializer + CustomTokenObtainPairSerializer
│   │   ├── views.py         # UsuarioViewSet + CustomTokenObtainPairView
│   │   ├── permissions.py   # IsAdminOrOwner (permisos granulares)
│   │   ├── tests.py         # Tests unitarios de la API de usuarios
│   │   └── urls.py          # Rutas /api/users/
│   ├── pedagogia/
│   │   ├── models.py        # Categoria, Asignatura, Recurso
│   │   ├── serializers.py   # Serializadores DRF con campos relacionales
│   │   ├── views.py         # ViewSets CRUD protegidos por JWT
│   │   └── urls.py          # Rutas /api/pedagogia/
│   ├── seed_mock_data.py    # Script de carga de datos de prueba
│   ├── reset_db.py          # Script de reinicio de base de datos
│   └── .env_modelo          # Modelo de variables de entorno
├── Frontend/
│   └── src/app/
│       ├── core/            # Servicios (AuthService, ApiService, UserService),
│       │                    # Guards (authGuard), Interceptors (authInterceptor)
│       ├── shared/          # Componentes reutilizables (Header, Footer)
│       ├── features/        # Vistas principales:
│       │   ├── login/       #   Login con Reactive Forms + JWT
│       │   ├── home/        #   Home (catalogo de plantillas)
│       │   ├── dashboard/   #   Dashboard (Repositorio, Sandbox, Componentes)
│       │   ├── users/       #   CRUD de Usuarios (tabla + formulario reactivo)
│       │   └── about/       #   Quienes Somos
│       └── app.routes.ts    # Routing con AuthGuard en rutas protegidas
└── docs/
    ├── wiki/                # Wiki del proyecto (Home, HU, Ceremonias)
    ├── sql/                 # Script DDL de creacion de BD
    └── *.pdf                # Documentos tecnicos y poster (APA)
```

---

## 8. Documentación

* [Wiki del Proyecto](https://github.com/ISPC-TSDWAD/ModPWeb--Dev6/wiki)
* [Diagrama Entidad-Relación](docs/der.md)
* [Script SQL](docs/sql/script_database.sql)

---

## Evidencias de Funcionamiento

### Evidencia 1 (Sprint 0): Bases de Datos y API
Validacion de la arquitectura base, endpoints RESTful y persistencia en MySQL.

| Conexion API REST (Backend) | Base de Datos (MySQL) |
| :---: | :---: |
| <img src="docs/capturas/Test%20conection%20-%20backend.png" alt="Backend API" width="400"/> | <img src="docs/capturas/Test%20conection%20-%20bd.png" alt="Base de Datos" width="400"/> |

### Evidencia 2 (Sprint 1): Sandbox y Consumo de API
Integracion del Frontend en Angular consumiendo los endpoints de Django y renderizado de componentes.

<div align="center">
  <img src="docs/capturas/Test%20conection%20-%20frontend.png" alt="Frontend Console" width="800"/>
  <br/>
  <i>Renderizado del Dashboard en Angular y consumo de datos</i>
</div>

### Evidencia 3 (Sprint 2): Integracion Completa y Persistencia Real
Conexion real entre Angular y Django REST Framework con autenticacion JWT, CRUD completo de Usuarios y Recursos, formularios reactivos con validaciones y persistencia en MySQL.

**Funcionalidades implementadas en este Sprint:**
- Login seguro con JWT (SimpleJWT) y proteccion de rutas con AuthGuard
- CRUD completo de Usuarios con permisos granulares (IsAdminOrOwner)
- CRUD completo de Recursos Pedagogicos con relaciones FK (Categoria, Asignatura)
- Formularios Reactivos (ReactiveForms) con validaciones sincronas y mensajes de feedback
- Interceptor HTTP para inyeccion automatica de tokens y manejo de sesion expirada (401)
- Exportacion de recursos en formato DOC y HTML
- Tests unitarios del backend (API de Usuarios)

**Nota de Integracion:** Consulte la [Documentacion Oficial de Inicio de Proyecto (Ev2)](docs/EduTools_Documentacion_formal_Ev2.md) y el [Documento Tecnico Sprint 2](docs/Documento_Tecnico_Sprint_2.pdf) para un desglose completo.
