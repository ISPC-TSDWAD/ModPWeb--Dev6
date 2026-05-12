# DOCUMENTACIÓN OFICIAL DE INICIO DE PROYECTO DE SOFTWARE
## Proyecto: EduTools — Gestión y Sandbox Pedagógico
**Institución:** Instituto Superior Politécnico Córdoba (ISPC)  
**Carrera:** Tecnicatura Superior en Desarrollo Web y Aplicaciones Digitales  
**Materia / Práctica:** Práctica Profesionalizante / Proyecto Integrador Final  
**Equipo de Desarrollo:** DEV6  
**Líder Técnico / Product Owner:** Jonathan Guillén  
**Fecha de Presentación:** 12/05/2026  
**Versión del Documento:** 4.0.0 (Alineada a Estándares Oficiales de Software y PMI)

---

## ÍNDICE
1. [Definición y Contexto del Proyecto](#1-definición-y-contexto-del-proyecto)
2. [Viabilidad Técnica y Económica](#2-viabilidad-técnica-y-económica)
3. [Alcance del Proyecto](#3-alcance-del-proyecto)
4. [Objetivos SMART del Proyecto](#4-objetivos-smart-del-proyecto)
5. [Requisitos Funcionales y No Funcionales](#5-requisitos-funcionales-y-no-funcionales)
6. [Identificación de Stakeholders y Roles del Equipo](#6-identificación-de-stakeholders-y-roles-del-equipo)
7. [Historias de Usuario](#7-historias-de-usuario)
8. [Enlaces y Herramientas del Proyecto](#8-enlaces-y-herramientas-del-proyecto)
9. [Bibliografía](#9-bibliografía)

---

## 1. DEFINICIÓN Y CONTEXTO DEL PROYECTO

### 1.1. Nombre del Proyecto
**EduTools — Sistema Integral de Gestión y Sandbox Pedagógico**

### 1.2. Problema u Oportunidad que Resuelve
En el diseño y montaje de aulas virtuales para educación superior a distancia, se identificaron fricciones severas que degradan la calidad del producto final y aumentan exponencialmente los tiempos de entrega (Time-to-Market):
*   **La Tiranía del Código:** El 80% de los Asesores Pedagógicos carecen de conocimientos técnicos avanzados para estructurar y editar código HTML semántico, generando cuellos de botella al depender de perfiles de maquetación para ajustes menores.
*   **Inconsistencia de Identidad Visual:** La ausencia de una previsualización en tiempo real con las hojas de estilo institucionales provoca una fragmentación visual en los contenidos, afectando la legibilidad y la reputación académica.
*   **Dispersión y Pérdida de Activos Pedagógicos:** Los recursos interactivos desarrollados quedan aislados en repositorios locales o correos, impidiendo su curaduría, actualización sistemática y filtrado transversal por **Asignatura**.

### 1.3. Descripción Breve (Elevator Pitch)
**EduTools** es una plataforma web centralizada que actúa como puente colaborativo entre Asesores Pedagógicos y Maquetadores en el ecosistema de educación virtual. Ofrece un entorno controlado de diseño (Sandbox) en modo natural que inyecta automáticamente hojas de estilo institucionales sobre componentes pedagógicos altamente interactivos. Permite gestionar, categorizar y filtrar recursos por asignatura para potenciar su reutilización estratégica. Además, agiliza la exportación masiva de compendios de código limpio en formatos estándar (`.doc` y `.html`) listos para su despliegue en plataformas LMS como Canvas. Con esto, elimina las barreras técnicas y garantiza una identidad visual premium y coherente desde la fase de concepción de los contenidos.

### 1.4. Organización o Cliente Destinatario
**Destinatario Principal:** Instituto Superior Politécnico Córdoba (ISPC).  
**Usuarios Directos:** Equipos de Asesoría Pedagógica (creadores de contenido) y Equipos de Maquetación Web / Desarrollo de Contenidos Digitales.

### 1.5. Justificación del Proyecto (Referencia PMI)
Siguiendo los lineamientos del **Project Management Institute (PMI)**, este documento funciona como el **Acta de Constitución del Proyecto (Project Charter)**, estableciendo formalmente la existencia del proyecto y confiriendo autoridad al Líder Técnico. 
*   **Principio de Entrega de Valor (PMBOK 7 — Principio 2):** El proyecto prioriza la creación de valor tangible y sostenible. Al estandarizar la capa de presentación de los contenidos educativos, se reduce drásticamente la **Carga Cognitiva Extrínseca** del estudiante final, permitiéndole enfocar sus recursos mentales en el aprendizaje y no en descifrar interfaces inconsistentes.
*   **Alineación Estratégica ("Por qué" antes del "Qué"):** La iniciativa se conecta directamente con los objetivos organizacionales del ISPC de excelencia académica, optimización de recursos internos y escalabilidad en la oferta educativa virtual, reduciendo en un 40% las iteraciones ociosas de soporte técnico en aulas virtuales.

---

## 2. VIABILIDAD TÉCNICA Y ECONÓMICA

### 2.1. Viabilidad Técnica
#### Stack Tecnológico Propuesto y Justificación
*   **Frontend (Capa de Presentación y Sandbox):** **Angular 18** (SPA moderna). Se justifica por su robustez corporativa, su arquitectura limpia basada en **Standalone Components** y el uso intensivo de la nueva API de **Signals** para optimizar la reactividad y el ciclo de detección de cambios en el editor visual.
*   **Estilos y Sistema de Diseño:** **Tailwind CSS**. Permite construir un *Design System* escalable mediante tokens de colores HSL personalizados y utilidades dinámicas, asegurando coherencia visual absoluta en Dark y Light mode sin inflar el peso de las hojas de estilo.
*   **Backend (Capa de Servicios y Lógica de Negocio):** **Django REST Framework (DRF)** con base de datos **MySQL**. Garantiza un modelado relacional sólido, integridad referencial estricta y endpoints seguros para el consumo de datos persistentes.

#### Infraestructura Requerida
*   **Entorno de Desarrollo:** Servidores locales Node.js para Angular CLI y entorno virtualizado de Python para Django.
*   **Entorno de Producción (Proyectado):** Despliegue del Frontend estático en servicios cloud distribuidos (ej. Vercel o AWS S3/CloudFront) y Backend alojado en contenedores escalables (ej. Render o AWS ECS) conectados a una instancia gestionada de MySQL.

#### Conocimientos Disponibles en el Equipo
El equipo **DEV6** cuenta con cobertura completa de roles Full Stack: especialización avanzada en desarrollo SPA con Angular (servicios, enrutamiento, RxJS/Signals), maquetación con Tailwind CSS, manipulación nativa del DOM para el motor WYSIWYG y modelado de bases de datos relacionales con exposición REST en Python/Django.

#### Dependencias Externas
*   Librerías de fuentes e iconos estandarizados (**Material Symbols** de Google).
*   APIs nativas del navegador (`document.execCommand` y APIs de generación de `Blob` para descargas locales).
*   No se requiere licenciamiento de software privativo, reduciendo barreras de entrada.

#### Riesgos Técnicos Iniciales Identificados
*   **Riesgo:** Discrepancias de renderizado de estilos institucionales complejos al exportar a formatos ofimáticos antiguos (`.doc`).
*   **Mitigación:** Inyección automatizada de estilos CSS embebidos y cabeceras XML de compatibilidad directamente en el flujo de bytes generados por el Frontend antes de la descarga.

### 2.2. Viabilidad Económica
#### Estimación de Esfuerzo
El esfuerzo proyectado para el desarrollo, pruebas e implementación de la versión estable (Ev2) se estima en un total de **280 horas/persona**, distribuidas a lo largo de los Sprints de concepción y consolidación.

#### Costos Principales
*   **Licencias de Software:** $0 (Uso exclusivo de tecnologías Open Source de nivel empresarial).
*   **Horas de Desarrollo (Equipo DEV6):** Costo interno absorbido como proyecto académico/práctica profesionalizante.
*   **Infraestructura Cloud (Proyectada para Producción):** Estimado en $50 USD mensuales para bases de datos relacionales y ancho de banda de consumo de recursos.

#### ROI o Beneficio Esperado
*   **Cualitativo:** Mejora sustancial en la moral del equipo pedagógico al ganar autonomía, y fortalecimiento de la imagen de marca institucional del ISPC en sus entornos virtuales.
*   **Cuantitativo:** Ahorro directo del 40% en tiempos de retrabajo y corrección de maquetación de aulas en Canvas, liberando horas hombre para tareas de innovación educativa.
*   **Naturaleza del Presupuesto:** Presupuesto *estimado* para fines de planificación y viabilidad del Proyecto Integrador.

---

## 3. ALCANCE DEL PROYECTO

### 3.1. Qué Incluye (In Scope)
#### Módulos y Funcionalidades Principales
1.  **Repositorio Institucional de Recursos:** Listado general con barra de búsqueda y sistema de **filtrado dinámico por Asignatura** (Matemáticas, Historia, Psicología, Transversal) y Categoría.
2.  **Sandbox de Diseño en Modo Natural:** Editor visual WYSIWYG con barra de herramientas profesional (Negrita, Cursiva, Subrayado, Listas, Color de texto) que inyecta semántica institucional en tiempo real.
3.  **Visualización Dual:** Pestaña paralela de visualización y copia de código HTML crudo (Raw HTML) para auditorías de maquetación.
4.  **Galería Pedagógica Estandarizada:** Catálogo de maquetas validadas (Acordeones HTML5 nativos, tarjetas de resaltado, **Chequeos de Comprensión H5P** interactivos con feedback de 3 partes y estándares de **Figuras** APA).
5.  **Motor de Interoperabilidad:** Módulo de exportación local para compendios en formatos `.doc` (Word) y `.html`.

#### Tipos de Usuarios Soportados
*   **Asesor Pedagógico:** Enfocado en la creación de contenidos, categorización académica y redacción enriquecida en el Sandbox.
*   **Maquetador Web:** Enfocado en la extracción de código limpio, revisión de estructura interna y copiado de fragmentos validados.
*   **Administrador:** Acceso global a la parametrización de categorías y materias en la base de datos.

#### Plataformas Soportadas
*   Diseño **Full-Width** y completamente adaptativo (Responsive) optimizado para resoluciones de escritorio (producción de contenidos) y tabletas/móviles (previsualización) en navegadores modernos.

### 3.2. Qué No Incluye (Out of Scope)
*   **Integración SSO Externa:** No se incluye autenticación mediante proveedores de identidad externos (OAuth/SAML de Canvas) en esta fase; se utiliza el sistema de usuarios nativo de Django REST Framework.
*   **Despliegue Directo por API a Canvas:** La publicación automatizada de recursos directamente dentro de los cursos de Canvas queda excluida para evitar sobreescribir configuraciones de cátedra. Se maneja mediante la exportación/importación limpia del código.
*   **Generación de Contenidos por IA:** Los módulos de creación automatizada de cuestionarios mediante Inteligencia Artificial se documentan como hitos para fases futuras.

---

## 4. OBJETIVOS SMART DEL PROYECTO

1.  **Objetivo de Estandarización Visual:** Garantizar que el **100% de los recursos pedagógicos** creados y exportados desde el Sandbox adopten automáticamente las directrices del *Design System* institucional, verificado mediante una auditoría de componentes sin reportes de estilos ad-hoc, para el cierre del **Sprint 1 (Evidencia 2)**.
2.  **Objetivo de Curaduría y Filtrado:** Implementar un motor de filtrado combinado por **Asignatura y Categoría** en el Repositorio que permita a los Asesores Pedagógicos aislar y localizar recursos específicos de su materia en **menos de 10 segundos** con una precisión del 100%, optimizando el tiempo de búsqueda antes de la defensa final del proyecto.
3.  **Objetivo de Autonomía de Edición:** Desarrollar una barra de herramientas de texto enriquecido (Modo Natural) plenamente funcional que reduzca el tiempo de formateo de un componente complejo a **menos de 2 minutos** para usuarios sin conocimientos de programación, validado mediante pruebas de usabilidad con perfiles docentes durante la entrega técnica de la Ev2.

---

## 5. REQUISITOS FUNCIONALES Y NO FUNCIONALES

### 5.1. Requisitos Funcionales (Prioridad MoSCoW)

*   **RF01: Gestión de Sesión y Autenticación**
    *   *Prioridad:* **Must**
    *   *Actor:* Todos los usuarios.
    *   *Descripción:* El sistema debe permitir el ingreso mediante credenciales seguras (usuario/contraseña) y gestionar los permisos según el rol asignado.
    *   *Criterio de Aceptación:* El formulario valida campos vacíos y rechaza accesos con credenciales inválidas mostrando un mensaje de error claro.
*   **RF02: Alta de Recursos con Clasificación por Asignatura**
    *   *Prioridad:* **Must**
    *   *Actor:* Asesor Pedagógico / Administrador.
    *   *Descripción:* El sistema debe proveer un formulario para crear nuevos recursos, exigiendo asociarlos explícitamente a una **Asignatura** y Categoría.
    *   *Criterio de Aceptación:* Al enviar el formulario válido, el recurso impacta en el listado general con su etiqueta de materia correspondiente.
*   **RF03: Filtrado Dinámico de Biblioteca**
    *   *Prioridad:* **Must**
    *   *Actor:* Asesor Pedagógico / Maquetador.
    *   *Descripción:* El repositorio debe filtrar en tiempo real los recursos mostrados al seleccionar una Asignatura específica en la barra superior.
    *   *Criterio de Aceptación:* Seleccionar "Matemáticas" oculta instantáneamente los recursos de "Historia" o "Psicología" sin recargar la página.
*   **RF04: Edición Visual Enriquecida (Sandbox RTE)**
    *   *Prioridad:* **Must**
    *   *Actor:* Asesor Pedagógico.
    *   *Descripción:* El Sandbox debe proveer botones de acción para aplicar Negrita, Cursiva, Subrayado, Listas y Color sobre el texto seleccionado.
    *   *Criterio de Aceptación:* Hacer clic en el botón de Negrita envuelve semánticamente el texto resaltado en etiquetas `<b>`/`<strong>` reflejando el cambio en vivo.
*   **RF05: Exportación Local de Compendios (DOC / HTML)**
    *   *Prioridad:* **Must**
    *   *Actor:* Asesor Pedagógico / Maquetador.
    *   *Descripción:* El sistema debe empaquetar y descargar los recursos filtrados como archivos físicos `.doc` o `.html` mediante un solo clic.
    *   *Criterio de Aceptación:* El archivo `.doc` descargado se abre correctamente en Microsoft Word conservando los estilos y textos definidos.
*   **RF06: Visualización de Estructura Interna (Raw HTML)**
    *   *Prioridad:* **Should**
    *   *Actor:* Maquetador Web.
    *   *Descripción:* El Sandbox debe incluir una pestaña para inspeccionar y copiar el código HTML subyacente del componente en edición.
    *   *Criterio de Aceptación:* Alternar a la pestaña "Código HTML" muestra el marcado exacto y permite copiarlo al portapapeles.
*   **RF07: Catálogo de Estándares Visuales y H5P**
    *   *Prioridad:* **Should**
    *   *Actor:* Todos los usuarios.
    *   *Descripción:* El Dashboard debe renderizar ejemplos interactivos de comprobación rápida y pautas institucionales de figuras.
    *   *Criterio de Aceptación:* Hacer clic en las opciones del simulador H5P despliega dinámicamente el feedback de acierto o corrección.

### 5.2. Requisitos No Funcionales

*   **RNF01: Rendimiento y Percepción de Carga**
    *   El tiempo de renderizado inicial del Dashboard y el cambio entre pestañas del Sandbox debe ejecutarse en menos de 1.5 segundos utilizando la reactividad de Angular Signals.
*   **RNF02: Usabilidad y Adaptabilidad (Full-Width UI)**
    *   La interfaz debe suprimir márgenes ociosos utilizando un diseño de ancho completo (`max-w-none`), garantizando una experiencia de usuario inmersiva y sin desbordamientos horizontales desde 1024px hasta pantallas 4K.
*   **RNF03: Persistencia e Integridad Referencial**
    *   La base de datos relacional MySQL debe resguardar la integridad referencial impidiendo la eliminación de Asignaturas o Categorías que posean recursos asociados (`ON DELETE PROTECT`).
*   **RNF04: Compatibilidad y Estándares Web**
    *   El código generado por el Sandbox debe cumplir con estándares HTML5 limpios y garantizar la compatibilidad transversal en navegadores basados en Chromium, Gecko y WebKit.

---

## 6. IDENTIFICACIÓN DE STAKEHOLDERS Y ROLES DEL EQUIPO

### 6.1. Mapa de Stakeholders

| Stakeholder | Rol / Puesto | Tipo | Interés | Influencia | Expectativas Principales | Canal de Comunicación |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **Prof. Titular / Tribunal** | Evaluador Académico | Externo | Alto | Alta | Cumplimiento estricto de lineamientos de ingeniería de software, código funcional y defensa sólida. | Entregables GitHub / Defensa Presencial |
| **Coord. Pedagógica** | Cliente / Patrocinador | Interno | Alto | Alta | Plataforma estable que garantice la estandarización visual de las aulas virtuales sin fricciones. | Reuniones de Revisión / Informes |
| **Asesores Pedagógicos** | Usuarios Finales | Interno | Alto | Media | Interfaz intuitiva, curva de aprendizaje nula en el Sandbox y filtrado eficiente por materia. | Pruebas de Usabilidad / Feedback |
| **Maquetadores Web** | Usuarios Finales | Interno | Alto | Media | Obtención de código limpio y pre-aprobado, reduciendo tiempos de depuración de estilos. | Repositorio / Issues |

### 6.2. Roles del Equipo Scrum (DEV6)

*   **Product Owner / Líder Técnico: Jonathan Guillén**
    *   *Responsabilidades:* Definición de la visión del producto, priorización absoluta del Backlog, toma de decisiones arquitectónicas y control exclusivo del flujo de Gitflow (aprobación y merge final hacia la rama `main` por seguridad).
*   **Scrum Master / Developer: Ale Corva**
    *   *Responsabilidades:* Facilitación de los procesos ágiles, eliminación de impedimentos técnicos y co-desarrollo de servicios de estado en Angular.
*   **Desarrollador Backend: Gonzalo Velasco**
    *   *Responsabilidades:* Diseño del DER relacional, confección de scripts SQL en MySQL y programación de serializadores y ViewSets en Django REST Framework.
*   **Desarrollador Frontend / UI: Daniela Salvo**
    *   *Responsabilidades:* Traslación de prototipos de diseño a maquetación real con Tailwind CSS, garantizando fidelidad visual y construyendo los ejemplos interactivos de la galería.
*   **Desarrollador QA / Formularios: Gerardo Romero**
    *   *Responsabilidades:* Implementación de validaciones en formularios reactivos y ejecución de pruebas cruzadas para asegurar la robustez de las descargas y filtros.

---

## 7. HISTORIAS DE USUARIO

A continuación se detallan las Historias de Usuario correspondientes a los requerimientos funcionales prioritarios (**Must**), redactadas bajo estándares ágiles y criterios Gherkin.

### US-01: Autenticación Segura
*   **Como** usuario del sistema,
*   **Quiero** iniciar sesión con mis credenciales únicas,
*   **Para** acceder a mi entorno de trabajo personalizado según mis niveles de permiso.
*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** me encuentro en la pantalla de Login y los campos están vacíos,
    *   **Cuando** intento enviar el formulario,
    *   **Entonces** el sistema bloquea la acción y resalta los campos requeridos.
    *   **Dado que** ingreso mis credenciales institucionales válidas,
    *   **Cuando** presiono el botón de ingreso,
    *   **Entonces** soy redirigido al Dashboard principal de EduTools exitosamente.
*   *Prioridad:* Alta (Must) | *Estimación:* 3 Story Points.

### US-02: Carga de Recurso con Asignatura
*   **Como** Asesor Pedagógico,
*   **Quiero** subir un nuevo recurso especificando su Asignatura y Categoría,
*   **Para** que quede correctamente clasificado en el mapa curricular de la plataforma.
*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** abro el formulario "Subir Recurso Nuevo",
    *   **Cuando** completo el título y selecciono la Asignatura "Matemáticas" desde el menú desplegable,
    *   **Entonces** el botón de envío se habilita para procesar el alta.
    *   **Dado que** envío el recurso correctamente categorizado,
    *   **Cuando** reviso la biblioteca de recursos recientes,
    *   **Entonces** visualizo la nueva tarjeta con un indicador visual claro de su materia.
*   *Prioridad:* Alta (Must) | *Estimación:* 5 Story Points.

### US-03: Filtrado Curricular en Repositorio
*   **Como** Asesor Pedagógico,
*   **Quiero** filtrar instantáneamente el listado general seleccionando una Asignatura,
*   **Para** visualizar únicamente los materiales pertinentes a mi área de supervisión.
*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** el repositorio muestra recursos de múltiples materias mezcladas,
    *   **Cuando** hago clic en la píldora de filtrado "Historia",
    *   **Entonces** la vista se actualiza mostrando exclusivamente los recursos asociados a Historia, ocultando el resto.
*   *Prioridad:* Alta (Must) | *Estimación:* 5 Story Points.

### US-04: Formateo en Sandbox (Modo Natural)
*   **Como** Asesor Pedagógico,
*   **Quiero** aplicar estilos de formato (Negrita, Itálica, Colores) usando una barra visual,
*   **Para** enriquecer el contenido pedagógico sin necesidad de manipular etiquetas HTML crudas.
*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** tengo un párrafo cargado en el área de previsualización visual del Sandbox,
    *   **Cuando** selecciono una frase y presiono el botón "B" (Negrita) en la barra superior,
    *   **Entonces** la frase adquiere el grosor de fuente adecuado instantáneamente en la pantalla.
    *   **Cuando** selecciono un color desde el selector de la barra,
    *   **Entonces** el texto seleccionado adopta dicho color de manera persistente en la vista.
*   *Prioridad:* Alta (Must) | *Estimación:* 8 Story Points.

### US-05: Exportación Limpia Multiformato
*   **Como** Maquetador Web,
*   **Quiero** descargar los recursos filtrados en formato `.doc` o `.html`,
*   **Para** integrarlos ágilmente en las plataformas LMS o compartirlos como documentos de revisión.
*   **Criterios de Aceptación (Gherkin):**
    *   **Dado que** apliqué un filtro para ver solo recursos de "Psicología",
    *   **Cuando** presiono el botón "Exportar a DOC",
    *   **Entonces** el navegador compila y descarga un archivo Word físico que contiene exactamente los recursos en pantalla.
*   *Prioridad:* Alta (Must) | *Estimación:* 5 Story Points.

---

## 8. ENLACES Y HERRAMIENTAS DEL PROYECTO

La gestión integral, el control de versiones y el Backlog inicial con la carga de las Historias de Usuario se encuentran auditados y disponibles en la plataforma GitHub:

*   🔗 **Repositorio Principal del Proyecto:** [ISPC-TSDWAD/ModPWeb--Dev6](https://github.com/ISPC-TSDWAD/ModPWeb--Dev6)
*   📋 **Tablero de Gestión y Backlog (GitHub Projects/Issues):** [Tablero DEV6 - EduTools](https://github.com/ISPC-TSDWAD/ModPWeb--Dev6/issues)
*   🌿 **Rama de Consolidación Técnica (Ev2):** `develop` y `ev2/jonathanGuillen` (Promocionadas a `main` bajo supervisión del Líder Técnico).

---

## 9. BIBLIOGRAFÍA

1.  **Project Management Institute (PMI).** (2021). *Guía de los Fundamentos para la Dirección de Proyectos (Guía del PMBOK®) – Séptima Edición*. Project Management Institute. (Enfoque en Dominios de Desempeño y Principios de Entrega de Valor).
2.  **Schwaber, K., & Beedle, M.** (2020). *La Guía de Scrum (The Scrum Guide)*. Scrum.org. Obtenido de directrices oficiales de roles, eventos y artefactos ágiles.
3.  **W3C Web Accessibility Initiative (WAI).** (2023). *Web Content Accessibility Guidelines (WCAG) 2.2*. Estandarización de componentes semánticos y contraste de color.

---
**FINAL DE LA DOCUMENTACIÓN OFICIAL DE SOFTWARE**  
**PROYECTO VALIDAD0 Y APROBADO TÉCNICAMENTE**
