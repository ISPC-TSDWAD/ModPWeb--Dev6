# Bitácora de Ceremonias Scrum 🔄

En esta sección documentamos el seguimiento de nuestras reuniones ágiles como equipo **DEV6**. La transparencia y la comunicación constante han sido pilares para mantenernos alineados durante el desarrollo de **EduTools**.

---

## 🚀 Sprint 2: Integración y Persistencia (Evidencia 3)

### 🎯 Sprint Planning (Sprint 2)
**Fecha:** Inicio del Sprint 2
**Duración:** 1 hora 15 min.
**Participantes:** Jonathan (Scrum Master/PO), Gonzalo, Ale, Gerardo, Daniela.
**Objetivo del Sprint:** Reemplazar los datos mockeados del Frontend, conectar Angular a la API real en Django (CRUD completo) y proteger las rutas con autenticación JWT.

**Resumen de la reunión:**
- Se revisó el backlog y se definieron 3 nuevas Historias de Usuario principales (HU-06, HU-07, HU-08).
- *Ale* propuso empezar fuerte con el servicio API en Angular para ir adelantando mientras *Gonzalo* levantaba los endpoints de Django.
- *Gerardo* levantó la mano para encargarse de las validaciones de los Reactive Forms que habían quedado pendientes del sprint anterior.
- *Jonathan* definió la separación estricta entre HUs de producto y las "Tasks" técnicas en el tablero de GitHub para mantener el orden.
- Se acordó que *Daniela* liderará la documentación formal y el diseño del Póster mientras los devs avanzan con el código.

---

### ☕ Daily Standups (Sprint 2 - Semana 1)

#### Daily 1
- **Gonzalo:** Ayer configuré el entorno virtual y la base de Django. Hoy voy a instalar `djangorestframework-simplejwt`. Sin bloqueos.
- **Ale:** Ayer revisé la documentación de RxJS para el manejo de errores. Hoy empiezo a reemplazar el `mockData` en `api.service.ts`. Bloqueo menor: necesito que Gonzalo me pase la URL local de prueba.
- **Gerardo:** Ayer analicé los flujos de login. Hoy arranco a programar el `AuthGuard` en Angular. Sin bloqueos.
- **Daniela:** Ayer estructuré el índice del Documento ABP. Hoy arranco a dibujar el Diagrama de Clases UML.
- **Jonathan:** Ayer armé el tablero en GitHub. Hoy estoy con la estructura de esta Wiki y ayudando a Gonzalo con la configuración de CORS.

#### Daily 2
- **Gonzalo:** Ayer terminé el endpoint de JWT. Hoy sigo con los ViewSets de Usuarios y Recursos. Todo en orden.
- **Ale:** Ayer conecté el login al endpoint de prueba de Gonzalo. Funcionó perfecto. Hoy empiezo a maquetar los modales de edición en el Dashboard.
- **Gerardo:** Ayer dejé listo el AuthGuard. Hoy me meto con los mensajes de error dinámicos en los formularios.
- **Daniela:** Terminé el diagrama UML. Hoy arranco a redactar la justificación técnica en el documento APA.
- **Jonathan:** Hoy arranco a redactar el Documento Técnico del Sprint 2 y hago code review del PR de Gerardo.

---

## ⏪ Sprint 1: Fundamentos (Evidencia 2)

### 🔍 Sprint Review & Retrospective
**Fecha:** Cierre del Sprint 1
**Duración:** 45 min.

**Review (Demostración):**
- Logramos un Dashboard interactivo en Angular.
- El Sandbox RTE (Editor Enriquecido) fue el mayor éxito técnico del sprint.
- Aprobamos la entrega de la Evidencia 2 con las 5 primeras HUs completadas (mockeadas).

**Retrospective (Qué mejorar):**
- **Lo que salió bien:** Muy buena comunicación asíncrona por el chat. El diseño visual propuesto por Daniela gustó mucho.
- **Lo que hay que mejorar:** Tuvimos algunos problemas al hacer merge en GitHub porque dos personas tocaron el `app.module.ts`. 
- **Plan de acción para Sprint 2:** Acordamos usar ramas estrictas tipo `feature/issue-XX` y no hacer merge directos a `develop` sin pasar por el Code Review de Jonathan.
