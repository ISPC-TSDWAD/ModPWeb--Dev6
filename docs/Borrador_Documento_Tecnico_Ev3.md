# Documento Técnico Evidencia 3 (Borrador Formato APA)

> **Instrucciones para el Alumno:** Copia el texto a partir de la línea divisoria hacia un archivo de Microsoft Word o Google Docs. 
> 1. Configura la fuente en **Times New Roman, tamaño 12**.
> 2. Aplica **Interlineado Doble (2.0)**.
> 3. Añade la portada estándar institucional del ISPC.
> 4. Donde dice `[INSERTAR CAPTURA DE PANTALLA AQUI]`, reemplaza ese texto por la imagen correspondiente.
> 5. Exporta el documento final a PDF y envíalo.

---

**Título:** Documento Técnico Sprint 2: Implementación e Integración REST (EduTools)  
**Proyecto:** EduTools — Gestión y Sandbox Pedagógico  
**Equipo:** DEV 6  

### 1. Introducción
El presente documento técnico expone los avances realizados durante el Sprint 2 (correspondiente a la Evidencia 3) para el proyecto EduTools. El objetivo principal de este sprint fue consolidar una aplicación funcional, escalable y modular, estableciendo la conexión real entre el cliente (Frontend) y el servidor (Backend) mediante el consumo de APIs REST. Además, se implementaron buenas prácticas arquitectónicas y se habilitó un flujo seguro de autenticación utilizando JSON Web Tokens (JWT).

### 2. Arquitectura Implementada

#### 2.1. Arquitectura Frontend (Angular)
El lado del cliente se migró hacia una arquitectura modular escalable recomendada para proyectos empresariales en Angular 17+. La estructura de archivos se reorganizó separando las responsabilidades en tres capas principales: `core/` (servicios, interceptores, guardias y modelos de uso global), `shared/` (componentes reutilizables como cabeceras y pies de página) y `features/` (las vistas principales como el Dashboard y el Login). Adicionalmente, se actualizó la sintaxis de las directivas estructurales obsoletas (`*ngIf` y `*ngFor`) por la nueva sintaxis nativa de control de flujo (`@if` y `@for`), mejorando el rendimiento de renderizado.

#### 2.2. Arquitectura Backend (Django REST Framework)
Se procedió con una refactorización profunda para abandonar el esquema monolítico inicial (una única aplicación `api`). El backend ahora consta de dos aplicaciones desacopladas:
- **`users`:** Responsable exclusivo de la gestión de identidades, conteniendo el modelo `Usuario` personalizado y la lógica de autenticación.
- **`pedagogia`:** Responsable del dominio de negocio, albergando los modelos `Categoria`, `Asignatura` y `Recurso`.
Esta modularización asegura el cumplimiento del principio de responsabilidad única (SRP) y previene errores de dependencias circulares (circular imports) a futuro.

#### 2.3. Integración y Seguridad
La integración entre ambas tecnologías se materializa mediante solicitudes HTTP asíncronas con la librería `HttpClient` de Angular y RxJS. Para garantizar la seguridad en el acceso a las rutas protegidas, se incorporó la librería `djangorestframework-simplejwt` en Django. El Frontend, por su parte, intercepta todas las peticiones salientes a través de un `HttpInterceptor` funcional (`authInterceptor`) que inyecta automáticamente el token de acceso en la cabecera `Authorization: Bearer <token>`, permitiendo la interacción persistente con la base de datos relacional MySQL.

### 3. Funcionalidades Desarrolladas

#### 3.1. Descripción Técnica y Documentación de Endpoints
Se desarrollaron e integraron los servicios para soportar operaciones CRUD sobre las entidades principales. Las vistas en Django fueron configuradas a través de `ModelViewSets` para exponer automáticamente el esquema RESTful, protegidas mediante la clase de permiso `IsAuthenticated`.

**Endpoint de Autenticación (Login):**
- **URL:** `POST /api/token/`
- **Descripción:** Valida las credenciales del usuario y retorna los tokens JWT de acceso y refresco.
- **Request (Ejemplo):**
  ```json
  {
      "username": "admin@edutools.edu.ar",
      "password": "password_segura_123"
  }
  ```
- **Response (Ejemplo 200 OK):**
  ```json
  {
      "refresh": "eyJhbGciOiJIUzI1Ni...",
      "access": "eyJhbGciOiJIUzI1Ni..."
  }
  ```

**Endpoint de Recursos Pedagógicos (Lectura):**
- **URL:** `GET /api/pedagogia/recursos/`
- **Descripción:** Retorna el catálogo completo de recursos.
- **Cabecera requerida:** `Authorization: Bearer <access_token>`
- **Response (Ejemplo 200 OK):**
  ```json
  [
      {
          "id": 1,
          "titulo": "Llamado a la Acción",
          "html_content": "<div class='card'>...</div>",
          "categoria": 1,
          "asignatura": 2
      }
  ]
  ```

#### 3.2. Diagramas
*(Nota: Inserte a continuación las imágenes de los diagramas solicitados)*

**Diagrama de Entidad-Relación (DER) y Modelo Relacional:**
[INSERTAR CAPTURA DE PANTALLA DEL DER AQUI]

**Diagrama de Clases (UML):**
[INSERTAR CAPTURA DE PANTALLA DEL DIAGRAMA DE CLASES AQUI]

#### 3.3. Evidencias Visuales y Pruebas Funcionales
El sistema permite el flujo completo de información. El usuario se autentica en el Frontend, el token es almacenado en el almacenamiento local (`localStorage`), y el sistema procede a cargar dinámicamente los recursos consumiendo la API de pedagogía.

**Pantalla de Login:**
[INSERTAR CAPTURA DE PANTALLA DEL LOGIN AQUI]

**Dashboard con Recursos obtenidos vía API:**
[INSERTAR CAPTURA DE PANTALLA DEL DASHBOARD AQUI]

### 4. Problemas Encontrados y Resolución

El mayor obstáculo técnico enfrentado durante este sprint surgió al momento de aplicar las nuevas migraciones de Django tras dividir la aplicación monolítica en `users` y `pedagogia`. Debido a que la base de datos MySQL local (`ModPWeb--Dev6`) aún conservaba las tablas autogeneradas por la aplicación antigua eliminada (como `django_admin_log` y los modelos obsoletos), el comando `python manage.py migrate` arrojaba errores de tipo `OperationalError: (1050, "Table 'nombre_tabla' already exists")`.
**Resolución:** Se instruyó a todo el equipo de desarrollo para eliminar (`DROP DATABASE`) y recrear la base de datos MySQL desde cero en sus entornos locales. Una vez limpiada la persistencia residual, las migraciones se aplicaron con éxito y se construyó el nuevo esquema normalizado.

### 5. Próximos Pasos (Roadmap Sprint 3)
De cara al próximo sprint, los esfuerzos del equipo DEV 6 se centrarán en:
- Implementar la migración de `ngModel` hacia `ReactiveForms` (Formularios Reactivos) para la carga y validación estricta de nuevos recursos pedagógicos desde la UI (HU-08).
- Finalizar el desarrollo del CRUD completo de Usuarios en el panel de administrador.
- Ejecutar pruebas funcionales de extremo a extremo (E2E) para asegurar que la descarga en formatos DOC/HTML funcione correctamente con los datos traídos de la API.
