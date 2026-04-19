# EduTools - Gestión y Sandbox Pedagógico 🎓

EduTools es una plataforma web diseñada para optimizar el flujo de trabajo entre los equipos de Asesoría Pedagógica y Maquetación en entornos de educación a distancia (Canvas LMS). 

## 1. Situación Problemática
Se ha detectado una brecha crítica en el montaje de aulas virtuales:
* **Dispersión de la Información:** Instructivos y manuales fragmentados.
* **Dependencia Técnica:** Los asesores no pueden previsualizar contenidos con estilos institucionales antes de la maquetación.
* **Iteraciones Ineficientes:** El 30% de los tickets sufren demoras por desajustes técnicos o estéticos.

## 2. Solución Propuesta
EduTools centraliza recursos y ofrece un **Sandbox de Diseño** que emula la hoja de estilos institucional. Esto permite generar un "output" HTML limpio, asegurando la coherencia visual desde la fase de diseño y optimizando el traspaso al equipo técnico.

## 3. Requerimientos del Sistema (Evidencia 1)

### Requerimientos Funcionales (RF)
* **RF1 - Gestión de Recursos (CRUD):** El sistema permite administrar manuales, links y plantillas.
* **RF2 - Filtros de Búsqueda:** Clasificación de recursos por etiquetas (H5P, LTI, Exámenes).
* **RF3 - Editor Sandbox:** Interfaz de edición con previsualización CSS institucional en tiempo real.
* **RF4 - Galería de Componentes:** Biblioteca de elementos visuales (acordeones, banners) listos para usar.
* **RF5 - Gestión de Roles:** Acceso diferenciado para Administradores (Maquetadores) y Usuarios (Asesores).

### Requerimientos No Funcionales (RNF)
* **RNF1 - Persistencia:** Almacenamiento relacional en MySQL.
* **RNF2 - Integración:** Comunicación segura entre Frontend y Backend mediante CORS.
* **RNF3 - Interfaz:** Diseño responsivo basado en Bootstrap 5.

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
4. Instalar dependencias: `pip install django django-cors-headers djangorestframework mysqlclient python-dotenv`
5. Configurar el archivo `.env` con tus credenciales de MySQL.
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