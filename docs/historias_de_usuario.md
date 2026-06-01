# Historias de Usuario — EduTools (Sprint 1)
## Proyecto: EduTools — Gestión y Sandbox Pedagógico | Equipo DEV6

> **Metodología:** Scrum | **Sprint:** 1 (Evidencia 2) | **Fecha:** Mayo 2026
> 📎 Ver también: [Documentación Formal Ev2](EduTools_Documentacion_formal_Ev2.md) | [Modelo Relacional](modelo_relacional.md)

---

## Sprint Backlog — Hoja de Cálculo Principal

| ID HU | Historia de Usuario | Criterios de Aceptación | Estimación (SP) | Prioridad MoSCoW | Sprint |
|:---:|---|---|:---:|:---:|:---:|
| **HU-01** | Como usuario, quiero iniciar sesión con mis credenciales, para acceder a mi entorno de trabajo personalizado. | CA-01, CA-02 | 3 | Must Have | 1 |
| **HU-02** | Como asesor pedagógico, quiero ver un Dashboard con los recursos de la API, para conocer el catálogo institucional. | CA-03, CA-04 | 5 | Must Have | 1 |
| **HU-03** | Como asesor pedagógico, quiero filtrar recursos por asignatura, para ver solo los materiales de mi materia. | CA-05, CA-06 | 5 | Must Have | 1 |
| **HU-04** | Como asesor pedagógico, quiero editar recursos con una barra visual (Negrita, Cursiva, Color), para formatear sin HTML. | CA-07, CA-08 | 8 | Must Have | 1 |
| **HU-05** | Como maquetador, quiero descargar recursos en `.doc` o `.html`, para integrarlos en el LMS. | CA-09, CA-10 | 5 | Must Have | 1 |
| **HU-06** | Como usuario, quiero que mi inicio de sesión sea verificado de forma segura en el servidor, para proteger mis datos y accesos. | CA-11, CA-12 | 5 | Must Have | 2 |
| **HU-07** | Como administrador, quiero crear, editar y eliminar usuarios en el sistema, para mantener el control de accesos institucionales. | CA-13, CA-14 | 8 | Must Have | 2 |
| **HU-08** | Como asesor pedagógico, quiero que los recursos que creo o edito se guarden de forma permanente en la base de datos, para no perder mi trabajo entre sesiones. | CA-15, CA-16 | 8 | Must Have | 2 |

---

## Criterios de Aceptación — Formato Gherkin

| CA | Escenario | Dado que | Cuando | Entonces |
|:---:|---|---|---|---|
| **CA-01** | Login con campos vacíos | El usuario está en la pantalla de Login con campos vacíos | Intenta enviar el formulario | El sistema bloquea la acción y resalta los campos requeridos |
| **CA-02** | Login exitoso | El usuario ingresa credenciales válidas | Presiona el botón "Entrar" | Es redirigido al Dashboard principal de EduTools |
| **CA-03** | Carga de recursos desde API | El usuario accede al Dashboard | La vista termina de cargar | Se muestran los recursos como tarjetas con nombre y categoría |
| **CA-04** | Visualización de componentes institucionales | El Dashboard está cargado | El usuario navega por la biblioteca | Puede ver videos, lecturas, actividades y acordeones en el panel |
| **CA-05** | Filtrado por asignatura | El repositorio muestra recursos mezclados | El usuario selecciona una asignatura del filtro | Solo se muestran los recursos de esa asignatura, sin recargar la página |
| **CA-06** | Restaurar vista completa | El usuario tiene un filtro de asignatura activo | Selecciona la opción "Todas" | El repositorio muestra nuevamente todos los recursos |
| **CA-07** | Aplicar negrita en Sandbox | Hay texto cargado en el Sandbox | El usuario selecciona una palabra y hace clic en Negrita | El texto se muestra en negrita visualmente en tiempo real |
| **CA-08** | Inspección de HTML generado | El usuario editó texto en el Sandbox | Cambia a la pestaña "Código HTML" | Se muestra el marcado exacto con la etiqueta aplicada |
| **CA-09** | Exportar a .doc | El usuario tiene recursos visibles (con o sin filtro) | Hace clic en "Exportar DOC" | El navegador descarga un archivo `.doc` válido que abre en Word |
| **CA-10** | Exportar a .html | El usuario tiene recursos visibles (con o sin filtro) | Hace clic en "Exportar HTML" | El navegador descarga un archivo `.html` estándar con el contenido |
| **CA-11** | Login seguro correcto | El usuario ingresa credenciales válidas en la UI | El Backend valida el JWT | El usuario obtiene acceso a las rutas protegidas |
| **CA-12** | Ruta protegida sin token | Un visitante intenta acceder a /dashboard directo | No provee un token JWT válido | El sistema bloquea el acceso y lo redirige al /login |
| **CA-13** | Crear usuario admin | El admin envía un formulario de nuevo usuario | Los datos pasan la validación del Backend | El usuario se guarda en la DB MySQL y aparece en la lista |
| **CA-14** | Error en CRUD Usuarios | El admin intenta crear un usuario sin email | El formulario detecta el error | Se muestra un feedback visual claro de que el campo es requerido |
| **CA-15** | Guardar recurso persistente | El asesor crea o edita un recurso en el Dashboard | Se envía un POST/PUT a la API | El recurso queda guardado en MySQL con su relación a Asignatura |
| **CA-16** | Eliminar recurso persistente | El asesor presiona Eliminar en un recurso | Confirma el cuadro de diálogo | El recurso desaparece de la UI y se hace un DELETE en MySQL |

---

## Detalle de Historias de Usuario

### HU-01 — Autenticación de Sesión
- **Como:** Usuario del sistema
- **Quiero:** Iniciar sesión con mis credenciales únicas
- **Para:** Acceder a mi entorno de trabajo personalizado
- **Prioridad:** Must Have | **Estimación:** 3 SP | **Sprint:** 1
- **Componente:** `Frontend/src/app/pages/login/`
- **Estado:** ✅ Done

---

### HU-02 — Panel de Recursos (Dashboard con API)
- **Como:** Asesor Pedagógico
- **Quiero:** Ver un panel interactivo con los recursos pedagógicos obtenidos desde la API
- **Para:** Conocer el catálogo institucional actualizado
- **Prioridad:** Must Have | **Estimación:** 5 SP | **Sprint:** 1
- **Componente:** `Frontend/src/app/pages/dashboard/`, `Frontend/src/app/services/api.service.ts`
- **Estado:** ✅ Done

---

### HU-03 — Filtrado Curricular por Asignatura
- **Como:** Asesor Pedagógico
- **Quiero:** Filtrar instantáneamente el listado seleccionando una Asignatura
- **Para:** Visualizar únicamente los materiales pertinentes a mi materia
- **Prioridad:** Must Have | **Estimación:** 5 SP | **Sprint:** 1
- **Componente:** `Dashboard` — `getRecursosFiltrados()`, binding `filtroMateria`
- **Estado:** ✅ Done

---

### HU-04 — Editor Visual Enriquecido (Sandbox RTE)
- **Como:** Asesor Pedagógico
- **Quiero:** Aplicar estilos (Negrita, Cursiva, Color) usando una barra de herramientas visual
- **Para:** Enriquecer el contenido pedagógico sin escribir etiquetas HTML
- **Prioridad:** Must Have | **Estimación:** 8 SP | **Sprint:** 1
- **Componente:** `Dashboard` — `formatText()`, tabs `visual/html`, `copiarHTML()`
- **Estado:** ✅ Done

---

### HU-05 — Exportación Multiformato (DOC / HTML)
- **Como:** Maquetador Web
- **Quiero:** Descargar los recursos filtrados en formato `.doc` o `.html`
- **Para:** Integrarlos ágilmente en el LMS institucional sin retrabajo
- **Prioridad:** Must Have | **Estimación:** 5 SP | **Sprint:** 1
- **Componente:** `Dashboard` — `exportarDoc()`, `descargarHtml()`
- **Estado:** ✅ Done

---

### HU-06 — Autenticación Segura y JWT
- **Como:** Usuario del sistema
- **Quiero:** Que mi inicio de sesión sea verificado de forma segura en el servidor
- **Para:** Proteger mis datos y accesos
- **Prioridad:** Must Have | **Estimación:** 5 SP | **Sprint:** 2
- **Componente:** `Backend (JWT)` + `Frontend (AuthGuard)`
- **Estado:** ⏳ To Do

---

### HU-07 — Gestión de Usuarios (CRUD)
- **Como:** Administrador
- **Quiero:** Crear, editar y eliminar usuarios en el sistema
- **Para:** Mantener el control de accesos institucionales
- **Prioridad:** Must Have | **Estimación:** 8 SP | **Sprint:** 2
- **Componente:** `Backend (API Usuarios)` + `Frontend (Formularios QA)`
- **Estado:** ⏳ To Do

---

### HU-08 — Persistencia de Recursos (CRUD)
- **Como:** Asesor Pedagógico
- **Quiero:** Que los recursos que creo o edito se guarden de forma permanente en la base de datos
- **Para:** No perder mi trabajo entre sesiones
- **Prioridad:** Must Have | **Estimación:** 8 SP | **Sprint:** 2
- **Componente:** `Backend (API Recursos)` + `Frontend (Integración HTTP)`
- **Estado:** ⏳ To Do

---

## Validación de Cumplimiento

| HU | Implementado | Archivo(s) clave |
|:---:|:---:|---|
| HU-01 | ✅ | `login.component.ts` — `login()` + `localStorage` |
| HU-02 | ✅ | `dashboard.component.ts` — `cargarRecursos()` + `ApiService` |
| HU-03 | ✅ | `dashboard.component.ts` — `getRecursosFiltrados()` |
| HU-04 | ✅ | `dashboard.component.ts` — `formatText()`, `onVisualEdit()` |
| HU-05 | ✅ | `dashboard.component.ts` — `exportarDoc()`, `descargarHtml()` |

> ✅ **Las 5 HU están implementadas y sus criterios de aceptación validados en el Sprint 1.**
