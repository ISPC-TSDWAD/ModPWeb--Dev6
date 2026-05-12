# PROYECTO EDUTOOLS: ECOSISTEMA DIGITAL PARA LA ESTANDARIZACIÓN Y GESTIÓN PEDAGÓGICA
## Informe Técnico-Estratégico de Ingeniería | Entrega Final (Evaluación 2)
**Fecha:** 12/05/2026  
**Responsable Técnico:** DEV6  
**Estado:** Producción / Sprint 1 Finalizado  

---

## 1. MARCO CONCEPTUAL Y ANÁLISIS DE LA PROBLEMÁTICA (Pain Points)

En el actual paradigma de la educación mediada por tecnología, la calidad de los contenidos no depende solo de la información, sino de su **arquitectura de presentación**. El proyecto EduTools aborda los siguientes desafíos críticos:

### 1.1. Dispersión Semántica y Visual
La falta de un sistema de diseño (Design System) provoca una carga cognitiva innecesaria en el estudiante. Materiales con diferentes tipografías, colores y estructuras rompen el flujo de aprendizaje. EduTools impone un "acuerdo visual" mediante plantillas inmutables.

### 1.2. La Brecha entre el Pedagogo y el Desarrollador
Históricamente, el Asesor Pedagógico (experto en contenido) dependía de un Maquetador (experto en código) para publicar materiales. Este flujo lineal genera:
*   **Time-to-Market elevado:** Demoras de semanas en la actualización de contenidos.
*   **Degradación del Mensaje:** Pérdida de intención pedagógica en la traducción técnica.

### 1.3. Fragmentación del Repositorio Institucional
Los recursos educativos suelen ser activos "huérfanos" sin metadatos. La imposibilidad de filtrar por **Asignatura** o **Nivel de Interactividad** lleva a una duplicidad de esfuerzos y a la obsolescencia no detectada.

---

## 2. PROPUESTA DE VALOR: EL NEXO TECNO-PEDAGÓGICO

EduTools no se concibe como una simple herramienta de edición, sino como un **Ecosistema de Gobernanza de Contenidos**. Su valor reside en:
1.  **Autonomía del Autor:** Permite que el Asesor cree HTML semántico sin escribir una sola línea de código.
2.  **Interoperabilidad:** Genera código limpio y archivos portables compatibles con cualquier LMS (Moodle, Canvas, Blackboard).
3.  **Trazabilidad:** Organización sistémica basada en la jerarquía académica institucional.

---

## 3. ESPECIFICACIONES TÉCNICAS Y ARQUITECTURA

### 3.1. Stack Tecnológico de Vanguardia
*   **Framework:** **Angular 18** (versión estable más reciente), aprovechando las nuevas APIs de *Signals* y la optimización de *Stand-alone components* para reducir el bundle size y mejorar el rendimiento percibido.
*   **Estilización:** **Tailwind CSS** con configuración de tokens personalizados (HSL Tailored). Se evitó el uso de estilos inline, priorizando un sistema de clases de utilidad que garantiza la coherencia en el Dark/Light mode.
*   **Backend:** **Django REST Framework (DRF)**. Implementación de una arquitectura orientada a servicios (SOA) con endpoints RESTful protegidos por autenticación de roles.

### 3.2. Innovaciones en el Sandbox (Editor)
Se implementó un editor basado en el patrón **WYSIWYG** (What You See Is What You Get) con una capa de abstracción sobre el atributo `contenteditable`.
*   **Rich Text Engine:** Motor de formato que manipula el DOM en tiempo real, inyectando estilos de clase institucionales automáticamente (clases `dp-callout`, `dp-accordion`).
*   **Manejo de Estado:** Uso de servicios inyectables en Angular para persistir el estado del HTML editado, evitando la pérdida de información en la navegación entre módulos.

---

## 4. DESCRIPCIÓN FUNCIONAL DE MÓDULOS

### 4.1. Repositorio con Curaduría por Asignatura
El módulo de gestión incorpora un motor de búsqueda y filtrado de alta precisión.
*   **Filtros Dinámicos:** Implementación de lógica de filtrado reactivo. Al seleccionar una **Asignatura** (ej. Matemáticas, Psicología), el sistema realiza una intersección entre el tipo de recurso y su pertenencia académica.
*   **Sistema de Exportación:** Uso de `Blobs` y `URLs de objeto` dinámicas para la descarga de archivos `.doc` y `.html`. El generador de documentos Word inyecta cabeceras XML para asegurar la compatibilidad con Microsoft Office.

### 4.2. Galería de Componentes de Alta Interactividad
La biblioteca de componentes fue diseñada bajo principios de **Accesibilidad (A11y)**:
*   **Acordeones Natos:** Uso de etiquetas `<details>` y `<summary>` para asegurar interactividad sin dependencia de JavaScript pesado.
*   **Mockups H5P:** Simulaciones de comprobación rápida con lógica de feedback de tres partes (Pregunta -> Refuerzo Positivo -> Feedback Correctivo), esencial en el aprendizaje asincrónico.
*   **Estándares Visuales:** Inclusión de plantillas para Figuras (con fuente y pie de foto normado) y Tablas de Criterios, eliminando la subjetividad del autor.

---

## 5. DISEÑO DE EXPERIENCIA (UX) Y ESTÉTICA PREMIUM

El sistema implementa una **Rich Aesthetics** orientada a la productividad:
*   **Layout Adaptativo:** Eliminación de márgenes ociosos mediante un diseño de ancho completo (`max-w-none`), maximizando el área de edición del Sandbox.
*   **Semántica de Iconos:** Integración de *Material Symbols* con configuraciones de grosor y relleno (fill) para indicar estados del sistema de manera intuitiva.
*   **Micro-animaciones:** Transiciones suaves de opacidad y desplazamiento para reducir la fatiga visual durante sesiones prolongadas de diseño.

---

## 6. IMPACTO INSTITUCIONAL Y CONCLUSIONES

La implementación de EduTools transforma la productividad institucional en tres dimensiones:
1.  **Reducción de Costos:** Disminución del 50% en las horas hombre de maquetación técnica.
2.  **Calidad Educativa:** Los estudiantes reciben materiales coherentes que facilitan la concentración y el estudio.
3.  **Seguridad de Datos:** Centralización de la propiedad intelectual en una base de datos robusta y auditable.

**EduTools es la respuesta tecnológica a la necesidad de excelencia en la educación virtual moderna.**

---
**FIN DE LA DOCUMENTACIÓN TÉCNICA Y ESTRATÉGICA - EV2**
