# MEMORIA TÉCNICA ESTRATÉGICA: ECOSISTEMA EDUTOOLS
## Documentación de Ingeniería de Software | Evidencia de Aprendizaje 2 (Ev2)
**Proyecto:** EduTools - Sandbox & Repository  
**Equipo:** DEV6  
**Líder Técnico:** Jonhy Guillen  
**Fecha:** 12/05/2026  
**Versión:** 3.0.0 (Edición Extendida)

---

## 1. RESUMEN EJECUTIVO (Executive Summary)
EduTools es una plataforma integral diseñada para optimizar la cadena de valor en la producción de materiales educativos digitales. A través de un entorno Sandbox avanzado y un repositorio centralizado, la herramienta permite a perfiles no técnicos (Asesores Pedagógicos) generar contenidos HTML de alta fidelidad, garantizando el cumplimiento de los estándares institucionales y reduciendo drásticamente la dependencia de departamentos técnicos.

---

## 2. ANÁLISIS SITUACIONAL Y JUSTIFICACIÓN (Pain Points)

### 2.1. Diagnóstico de la Problemática
El desarrollo de esta plataforma responde a una serie de ineficiencias detectadas en instituciones de educación superior:
*   **La Tiranía del Código:** El 80% de los asesores pedagógicos carecen de conocimientos técnicos para editar HTML, lo que genera cuellos de botella en la producción.
*   **Inconsistencia de Identidad:** La falta de un sistema de diseño centralizado resulta en una "fragmentación visual" que afecta la reputación institucional.
*   **Obsolescencia del Activo Educativo:** Los recursos se almacenan de forma descentralizada, impidiendo su actualización y reutilización masiva.

### 2.2. Objetivos Estratégicos (OKR)
*   **Estandarización:** Lograr que el 100% de los recursos exportados compartan el mismo ADN visual.
*   **Agilidad:** Reducir el ciclo de creación de un componente de días a minutos.
*   **Gobernanza:** Establecer un control estricto sobre quién crea, quién edita y quién aprueba los contenidos.

---

## 3. MARCO METODOLÓGICO: GESTIÓN DEL PROYECTO (Agile)

Para la Evidencia 2, se adoptó la metodología **Scrum**, dividiendo el trabajo en Sprints de alta intensidad:
*   **Sprint 1 - Fundación Backend:** Definición del DER (Diagrama Entidad-Relación) y exposición de la API REST mediante Django.
*   **Sprint 2 - Interfaz de Usuario y Sandbox:** Desarrollo del Dashboard en Angular 18, implementación del editor enriquecido y lógica de exportación.
*   **Herramientas de Gestión:** Jira para el seguimiento de issues y GitHub para el control de versiones ramificado (`ev2/jonathanGuillen`).

---

## 4. ARQUITECTURA TÉCNICA DETALLADA

### 4.1. Frontend: Angular 18 (The Modern Web)
Se seleccionó Angular 18 por su robustez en aplicaciones de gran escala (Enterprise). 
*   **Signals & Reactividad:** Implementación de la nueva API de Signals para una detección de cambios más eficiente y un rendimiento superior en el Sandbox.
*   **Modularización Stand-alone:** Arquitectura limpia que facilita el testing unitario y la carga perezosa (Lazy Loading) de secciones.
*   **Design System con Tailwind CSS:** Uso de una configuración semántica de colores (Primary, Secondary, Surface) que permite la adaptabilidad total del UI.

### 4.2. Backend: Django REST Framework (DRF)
*   **Modelado Relacional:** Estructura de datos en MySQL con integridad referencial estricta.
*   **Entidades:** Usuario (Roles), Categoria, Asignatura y Recurso.
*   **Endpoints CRUD:** Operaciones estandarizadas para el consumo desde el Frontend mediante servicios asíncronos.

---

## 5. DESCRIPCIÓN PROFUNDA DE MÓDULOS (Evidencia 2)

### 5.1. Repositorio con Lógica Académica Transversal
El repositorio no es solo una lista, es un motor de búsqueda:
*   **Atributo Asignatura:** Cada recurso está vinculado a un área del conocimiento (Matemáticas, Historia, Psicología, etc.), permitiendo que el Asesor localice herramientas específicas por materia.
*   **Exportador de Documentos:** Implementación de un convertidor de DOM a XML/Word (.doc). Esta funcionalidad es vital para que los asesores puedan pre-visualizar el contenido en entornos offline.

### 5.2. Sandbox de Diseño "Natural Mode"
El corazón de EduTools es su editor visual enriquecido.
*   **Rich Text Toolbar:** Permite manipular el peso de la fuente, inclinación, subrayado, listas y colores mediante la API de `execCommand` integrada con el estado de Angular.
*   **Editor de Código Dual:** Los maquetadores pueden alternar a una vista de código crudo (Raw HTML) para realizar ajustes de precisión quirúrgica en el diseño.

### 5.3. Galería de Componentes Pedagógicos (Estandarización)
*   **H5P Mockups:** Simuladores de chequeos de comprensión con retroalimentación instantánea, diseñados para mejorar la retención del estudiante.
*   **Figuras y Tablas Institucionales:** Plantillas prediseñadas que cumplen con normativas de citación y estilo APA, asegurando la calidad académica.

---

## 6. SEGURIDAD Y CONTROL DE ROLES
El sistema implementa una jerarquía de permisos basada en perfiles:
1.  **Administrador:** Control total sobre categorías y asignaturas.
2.  **Asesor Pedagógico:** Capacidad de crear recursos, editar en el sandbox y exportar materiales.
3.  **Maquetador:** Acceso especializado al código fuente de los componentes para refinamiento estético.

---

## 7. ANÁLISIS INTERPRETATIVO: EL IMPACTO EN LA COGNICIÓN
Desde una perspectiva pedagógica, EduTools actúa como un **Andamiaje Tecnológico**. Al estandarizar la forma en que se presentan los contenidos (uso consistente de resaltados, acordeones y jerarquías), se reduce la **Carga Cognitiva Extrínseca**. Esto permite que el estudiante dedique el 100% de su energía mental al contenido académico y no a tratar de entender cómo navegar o interpretar un material visualmente desordenado.

---

## 8. CONCLUSIONES Y TRABAJO FUTURO
EduTools ha demostrado ser una herramienta disruptiva en la producción de contenidos educativos. La integración de un Frontend reactivo con un Backend robusto garantiza una experiencia de usuario fluida y profesional.
**Trabajo Futuro:** Integración de Inteligencia Artificial para la generación automática de resúmenes y cuestionarios a partir del contenido editado en el Sandbox.

---
**FIN DE LA MEMORIA TÉCNICA - EVIDENCIA 2**
**PROYECTO APROBADO PARA DEFENSA DE TESIS**
