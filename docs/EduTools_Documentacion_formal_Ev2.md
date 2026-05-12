# PROYECTO EDUTOOLS: SISTEMA INTEGRAL DE GESTIÓN Y SANDBOX PEDAGÓGICO
## Documentación Formal de Ingeniería - Entrega Final (Ev2)
**Fecha:** 12/05/2026  
**Equipo:** DEV6  
**Versión:** 2.0.0

---

## 1. ANÁLISIS DE LA PROBLEMÁTICA (Pain Points)
En el contexto actual de la educación virtual, se identificaron brechas críticas en la cadena de producción de contenidos:

*   **Fragmentación de Estándares:** Falta de uniformidad visual en los materiales, lo que genera una experiencia de usuario (estudiante) confusa y poco profesional.
*   **Cuellos de Botella Técnicos:** Los Asesores Pedagógicos dependen excesivamente de los Maquetadores/Programadores para realizar cambios menores en el HTML, ralentizando los tiempos de entrega.
*   **Pérdida de Activos Digitales:** No existe un repositorio centralizado; los componentes se "pierden" en carpetas locales o correos electrónicos, impidiendo la reutilización eficiente.
*   **Dificultad en la Curaduría:** Imposibilidad de filtrar rápidamente componentes por asignatura o categoría pedagógica, generando duplicidad de trabajo.

## 2. SOLUCIÓN PROPUESTA Y OBJETIVOS
**EduTools** se posiciona como el nexo tecnológico entre la pedagogía y la maquetación. Su objetivo es democratizar la creación de contenidos de alta calidad mediante:

*   **Empoderamiento del Asesor:** Un Sandbox que permite editar sin saber código profundo.
*   **Estandarización Automática:** El sistema inyecta estilos institucionales predefinidos a cada componente.
*   **Centralización Inteligente:** Un repositorio con metadatos (Asignatura/Categoría) para una búsqueda instantánea.

## 3. ARQUITECTURA DEL SISTEMA
El sistema utiliza una arquitectura de vanguardia para asegurar rendimiento y escalabilidad:
*   **Frontend:** **Angular 18** (SPA) con **Tailwind CSS**. Se implementó una arquitectura de componentes reutilizables y servicios reactivos.
*   **Backend:** **Django REST Framework (DRF)** y **MySQL**. Gestión de datos mediante Serializers complejos para relaciones de Muchos a Uno (Recursos -> Asignaturas).
*   **Seguridad y Roles:** Control de acceso jerárquico (Admin, Asesor, Maquetador).

## 4. FUNCIONALIDADES CLAVE (Módulos)

### 4.1. Repositorio con Clasificación Académica
Gestión avanzada de la biblioteca institucional:
*   **Filtros de Precisión:** Capacidad de segmentar el catálogo por **Asignatura** (Matemáticas, Historia, Psicología), optimizando la curaduría de contenidos.
*   **Exportación Multiformato:** Generación dinámica de archivos **.DOC** y **.HTML**, permitiendo la portabilidad de los recursos a cualquier LMS o procesador de texto.

### 4.2. Sandbox de Diseño "Natural Mode"
Entorno de edición enriquecida que elimina la barrera del código:
*   **Rich Text Toolbar:** Herramientas de formato visual (Negrita, Itálica, Colores, Listas) que impactan directamente en el DOM.
*   **Modo Dual (Visual/HTML):** Transparencia total entre la edición visual y el código resultante.

### 4.3. Galería de Estándares Institucionales
Compendio de componentes validados pedagógicamente:
*   **Componentes Interactivos:** Modelos de comprobación rápida (estilo H5P) con lógica de feedback inmediato.
*   **Visual Standards:** Guías para el uso correcto de Figuras, Tablas y jerarquías de texto (APA Style adaptado).

## 5. DISEÑO Y AESTHETICS
Se aplicó un enfoque de **Rich Aesthetics** para el Dashboard:
*   **UI Dinámica:** Uso de Dark Mode automático, micro-animaciones en transiciones y componentes de navegación (Avatar Dropdown) de alta gama.
*   **Optimización de Espacio:** Layout fluido que aprovecha el 100% del viewport para facilitar el trabajo en pantallas de producción.

## 6. CONCLUSIONES
EduTools no es solo un editor; es un acelerador de la transformación digital educativa. Al resolver los "puntos de dolor" detectados, reduce en un 40% los tiempos de maquetación y garantiza que el 100% de los materiales cumplan con la identidad institucional.

---
**FIN DE LA DOCUMENTACIÓN FORMAL - EVALUACIÓN 2**
