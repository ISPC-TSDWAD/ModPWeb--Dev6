# EduTools - Gestión y Sandbox Pedagógico 🎓

EduTools es una plataforma web diseñada para optimizar el flujo de trabajo entre los equipos de Asesoría Pedagógica y Maquetación en entornos de educación a distancia (Canvas LMS). 

## 1. Situación Problemática
Se ha detectado una brecha crítica en el montaje de aulas virtuales:
* **Dispersión de la Información:** Instructivos y manuales fragmentados.
* **Dependencia Técnica:** Los asesores no pueden previsualizar contenidos con estilos institucionales antes de la maquetación.
* **Iteraciones Ineficientes:** El 30% de los tickets sufren demoras por desajustes técnicos o estéticos.

## 2. Solución Propuesta
EduTools centraliza recursos y ofrece un **Sandbox de Diseño** que emula la hoja de estilos institucional. Esto permite generar un "output" HTML limpio, asegurando la coherencia visual desde la fase de diseño y optimizando el traspaso al equipo técnico.

## 3. Especificación de Requerimientos (Evidencia 1)

### Requerimientos Funcionales (RF)
* **RF1:** El sistema deberá permitir al **[Usuario Administrador]** gestionar (crear, leer, actualizar y eliminar) el repositorio central de manuales, links y plantillas.
* **RF2:** El sistema deberá permitir al **[Usuario Asesor Pedagógico]** buscar, explorar y filtrar los recursos visuales disponibles mediante etiquetas y categorías (H5P, LTI, Exámenes).
* **RF3:** El sistema deberá permitir al **[Usuario Asesor Pedagógico]** editar contenido en el Sandbox y visualizar los estilos institucionales en tiempo real.
* **RF4:** El sistema deberá permitir al **[Usuario Maquetador]** previsualizar, seleccionar y copiar el código de los elementos visuales desde la Galería de Componentes para su inyección directa.
* **RF5:** El sistema deberá permitir a los **[Usuarios Autenticados]** iniciar sesión de forma segura y acceder a diferentes módulos según su nivel de privilegios (Administrador o Asesor).

### Requerimientos No Funcionales (RNF)
* **RNF1 - Persistencia e Integridad:** El sistema garantizará la persistencia de datos en un motor relacional (MySQL), aplicando restricciones de integridad referencial (Foreign Keys) estrictas para evitar datos huérfanos.
* **RNF2 - Desempeño y Usabilidad:** La interfaz de usuario asegurará tiempos de renderizado en la previsualización del Sandbox inferiores a 2 segundos bajo condiciones de red estándar, manteniendo la consistencia visual responsiva del framework Bootstrap 5 en resoluciones desde 320px hasta 4K.
* **RNF3 - Arquitectura e Integración:** La plataforma respetará una arquitectura desacoplada, comunicando el frontend (SPA) con el backend única y exclusivamente a través de una API REST, aplicando políticas de CORS seguras.

## 4. Stack Tecnológico
* **Frontend:** Angular 18 (Signals & Standalone Components).
* **Backend:** Django 6.0 + Django REST Framework.
* **Base de Datos:** MySQL.
* **Estilos:** Bootstrap 5.

---

## 🛠️ Instalación y Configuración

### Backend (Django)
1. Navegar a la carpeta: `cd Backend`
2. Crear entorno virtual: `python -m venv venv`
3. Activar entorno: `venv\Scripts\activate` (Windows)
4. Instalar dependencias: `pip install -r requirements.txt` *(Nota: incluye django, cors-headers, djangorestframework, mysqlclient, python-dotenv)*
5. Configurar el archivo `.env` basándose en el `.env_modelo` con las credenciales de MySQL local.
6. Correr migraciones: `python manage.py migrate`
7. Iniciar servidor: `python manage.py runserver`
   * *Nota: El servidor cuenta con redirección automática a la API en `http://127.0.0.1:8000/`*

### Frontend (Angular)
1. Navegar a la carpeta: `cd Frontend`
2. Instalar paquetes: `npm install`
3. Iniciar servidor: `ng serve`
4. Abrir en el navegador: `http://localhost:4200`

---
**Desarrollado por:** DEV6

## 📸 Evidencias de Funcionamiento

### Conexión Exitosa con el Backend
![Backend API](docs/capturas/Test%20conection%20-%20backend.png)

### Integración Frontend y Consola
![Frontend Console](docs/capturas/Test%20conection%20-%20frontend.png)