# Catálogo de Historias de Usuario

Este documento centraliza todas las Historias de Usuario (HU) definidas para el proyecto EduTools. Las historias están redactadas desde la perspectiva de los actores del sistema (Usuario, Asesor Pedagógico, Administrador, Maquetador) para asegurar que cada desarrollo entregue valor real.

## Sprint 1 (Evidencia 2) — Fundamentos y Frontend Mocks

| ID | Historia de Usuario | Estimación | Estado |
|:---:|---|:---:|:---:|
| **HU-01** | Como usuario, quiero iniciar sesión con mis credenciales, para acceder a mi entorno de trabajo personalizado. | 3 SP | ✅ Done |
| **HU-02** | Como asesor pedagógico, quiero ver un Dashboard con los recursos de la API, para conocer el catálogo institucional. | 5 SP | ✅ Done |
| **HU-03** | Como asesor pedagógico, quiero filtrar recursos por asignatura, para ver solo los materiales de mi materia. | 5 SP | ✅ Done |
| **HU-04** | Como asesor pedagógico, quiero editar recursos con una barra visual (Negrita, Cursiva, Color), para formatear sin HTML. | 8 SP | ✅ Done |
| **HU-05** | Como maquetador, quiero descargar recursos en `.doc` o `.html`, para integrarlos en el LMS. | 5 SP | ✅ Done |

---

## Sprint 2 (Evidencia 3) — Integración y Persistencia Real

| ID | Historia de Usuario | Estimación | Estado |
|:---:|---|:---:|:---:|
| **HU-06** | Como usuario, quiero que mi inicio de sesión sea verificado de forma segura en el servidor mediante JWT, para proteger mis datos y accesos. | 5 SP | ⏳ En Curso |
| **HU-07** | Como administrador, quiero crear, editar y eliminar usuarios en el sistema, para mantener el control de accesos institucionales. | 8 SP | ⏳ En Curso |
| **HU-08** | Como asesor pedagógico, quiero que los recursos que creo o edito se guarden de forma permanente en la base de datos MySQL, para no perder mi trabajo entre sesiones. | 8 SP | ⏳ En Curso |

---

## Ejemplos de Criterios de Aceptación (BDD / Gherkin)

Nuestra definición de "Done" exige que las HU cumplan con sus Criterios de Aceptación. Aquí se detallan los flujos críticos del **Sprint 2**:

**CA-11: Login seguro correcto (HU-06)**
- **Dado que** el usuario ingresa credenciales válidas en la UI
- **Cuando** el Backend valida el token JWT
- **Entonces** el usuario obtiene acceso a las rutas protegidas del Dashboard

**CA-12: Ruta protegida sin token (HU-06)**
- **Dado que** un visitante intenta acceder a `/dashboard` directamente
- **Cuando** no provee un token JWT válido en su navegador
- **Entonces** el sistema bloquea el acceso mediante AuthGuard y lo redirige a la pantalla de `/login`

**CA-13: Flujo de creación de Usuario (HU-07)**
- **Dado que** el administrador envía un formulario de nuevo usuario
- **Cuando** los datos pasan la validación del Backend
- **Entonces** el usuario se guarda en la base de datos MySQL y aparece inmediatamente en la lista de la interfaz

**CA-15: Guardar recurso persistente (HU-08)**
- **Dado que** el asesor crea o edita un recurso en el Dashboard
- **Cuando** se envía la petición POST/PUT a la API real
- **Entonces** el recurso queda guardado en la base de datos con su relación (Foreign Key) a Asignatura y Categoría.

---

## Requisitos No Funcionales (RNF)

Además de los requisitos de producto, el sistema EduTools cumple con los siguientes parámetros de calidad técnica:

1. **Seguridad:** 
   - Todas las peticiones al backend deben estar autenticadas mediante tokens JWT (JSON Web Tokens).
   - Las contraseñas de los usuarios no se guardan en texto plano, sino hasheadas con algoritmos criptográficos robustos en la base de datos.
2. **Accesibilidad:** 
   - La interfaz de usuario debe mantener un contraste de color adecuado y estructurar correctamente las etiquetas HTML (semántica) para el uso de lectores de pantalla.
3. **Mantenibilidad:** 
   - El backend sigue una arquitectura modular en Django (apps separadas para `users` y `pedagogia`).
   - El frontend en Angular respeta la segregación de responsabilidades (`core`, `shared`, `features`).
4. **Escalabilidad:** 
   - La arquitectura cliente-servidor (REST API) permite escalar el backend y frontend de forma independiente.
   - El esquema de base de datos relacional (MySQL) permite manejar miles de recursos de forma óptima usando índices.

> 📎 *Nota: El detalle exhaustivo técnico de la implementación de estas historias se documenta en el Documento Técnico del Sprint.*
