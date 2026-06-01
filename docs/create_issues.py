import subprocess
import os

os.environ["PATH"] += r";C:\Program Files\GitHub CLI"

repo = "ISPC-TSDWAD/ModPWeb--Dev6"
milestone = "Sprint 2 - Evidencia 3: Integración Completa"
label_doc = "documentación"

issues = [
    {
        "title": "Backend: Autenticación JWT",
        "body": "**Asignado a:** Gonzalo Velasco\n**Rama:** feature/issue-01\n\n### Descripción\nImplementar djangorestframework-simplejwt. Crear endpoints de login (/api/token/) y refresh (/api/token/refresh/). Proteger los ViewSets existentes con IsAuthenticated.\n\n### Criterios de aceptación\n- Endpoint /api/token/ devuelve access y refresh token con credenciales válidas\n- Endpoints protegidos rechazan peticiones sin token (401)\n- Token refresh funciona correctamente",
        "assignee": "g0niii",
        "label": "backend,sprint-2"
    },
    {
        "title": "Backend: CRUD Usuarios completo",
        "body": "**Asignado a:** Gonzalo Velasco\n**Rama:** feature/issue-02\n\n### Descripción\nAsegurar que el ViewSet de Usuarios permita Create, Read, Update, Delete con validaciones y permisos. Endpoint: /api/usuarios/.\n\n### Criterios de aceptación\n- GET /api/usuarios/ lista todos los usuarios\n- POST /api/usuarios/ crea un usuario nuevo con validación\n- PUT /api/usuarios/{id}/ actualiza datos\n- DELETE /api/usuarios/{id}/ elimina usuario",
        "assignee": "g0niii",
        "label": "backend,sprint-2"
    },
    {
        "title": "Backend: CRUD Recursos completo con filtros",
        "body": "**Asignado a:** Gonzalo Velasco\n**Rama:** feature/issue-03\n\n### Descripción\nValidar que el CRUD de Recursos funcione end-to-end con relaciones FK a Categoría, Asignatura y Usuario. Endpoint: /api/recursos/. Incluir filtro por asignatura (?asignatura=X).\n\n### Criterios de aceptación\n- CRUD completo funcionando con datos persistidos en MySQL\n- Filtro por asignatura operativo\n- Relaciones FK validadas (PROTECT)",
        "assignee": "g0niii",
        "label": "backend,sprint-2"
    },
    {
        "title": "Frontend: Conectar API real (reemplazar mocks)",
        "body": "**Asignado a:** Ale Corva\n**Rama:** feature/issue-04\n\n### Descripción\nReemplazar todos los métodos mock de api.service.ts por llamadas HTTP reales (this.http.get/post/put/delete) apuntando a los endpoints de Django. Configurar CORS en el backend.\n\n### Criterios de aceptación\n- getRecursos() consume GET /api/recursos/\n- createResource() consume POST /api/recursos/\n- eliminarRecurso() consume DELETE /api/recursos/{id}/\n- actualizarRecurso() consume PUT /api/recursos/{id}/\n- No quedan datos mock en el servicio",
        "assignee": "Corval-LC",
        "label": "frontend,sprint-2"
    },
    {
        "title": "Frontend: UI de CRUD completo en Dashboard",
        "body": "**Asignado a:** Ale Corva\n**Rama:** feature/issue-05\n\n### Descripción\nAgregar botones y modales para Editar y Eliminar recursos desde la interfaz. Feedback visual al usuario (toast/alerta de éxito/error).\n\n### Criterios de aceptación\n- Botón Editar abre formulario con datos precargados\n- Botón Eliminar pide confirmación antes de borrar\n- Mensaje de éxito/error visible al usuario",
        "assignee": "Corval-LC",
        "label": "frontend,sprint-2"
    },
    {
        "title": "Frontend: Manejo de errores HTTP",
        "body": "**Asignado a:** Ale Corva\n**Rama:** feature/issue-06\n\n### Descripción\nImplementar catchError y retry en el servicio API. Mostrar mensajes de error claros al usuario cuando el backend no responde o devuelve errores.\n\n### Criterios de aceptación\n- Errores 400/401/404/500 muestran mensaje descriptivo\n- Se implementa retry para errores de red\n- El usuario nunca ve una pantalla en blanco por error",
        "assignee": "Corval-LC",
        "label": "frontend,sprint-2"
    },
    {
        "title": "Frontend: Routing avanzado + AuthGuard",
        "body": "**Asignado a:** Ale Corva\n**Rama:** feature/issue-11\n\n### Descripción\nImplementar AuthGuard con canActivate para proteger rutas. Redireccionar a Login si no hay token. Lazy loading de componentes.\n\n### Criterios de aceptación\n- Rutas /home y /dashboard redirigen a /login si no hay token\n- Guard verifica token en localStorage\n- Componentes cargan con lazy loading",
        "assignee": "Corval-LC",
        "label": "frontend,sprint-2"
    },
    {
        "title": "QA: Validaciones avanzadas en formularios",
        "body": "**Asignado a:** Gerardo Romero\n**Rama:** feature/issue-07\n\n### Descripción\nAgregar validaciones asíncronas y síncronas avanzadas. Mensajes de feedback específicos por campo. Deshabilitar botón de envío cuando el form es inválido.\n\n### Criterios de aceptación\n- Cada campo muestra su mensaje de error específico\n- Botón de envío deshabilitado hasta que el formulario sea válido\n- Validación de longitud mínima/máxima funcional",
        "assignee": "GerLR",
        "label": "qa,sprint-2"
    },
    {
        "title": "QA: Login real contra Backend JWT",
        "body": "**Asignado a:** Gerardo Romero\n**Rama:** feature/issue-08\n\n### Descripción\nConectar el LoginComponent al endpoint de autenticación JWT de Django. Guardar el token en localStorage. Implementar flujo completo de autenticación.\n\n### Criterios de aceptación\n- Login envía credenciales a /api/token/\n- Token se guarda en localStorage al autenticarse\n- Credenciales inválidas muestran error claro\n- Logout limpia el token",
        "assignee": "GerLR",
        "label": "qa,sprint-2"
    },
    {
        "title": "Docs: Diagrama de Clases del sistema",
        "body": "**Asignado a:** Daniela Salvo\n**Rama:** feature/issue-12\n\n### Descripción\nCrear el Diagrama de Clases del sistema EduTools que muestre las entidades (Usuario, Categoría, Asignatura, Recurso), sus atributos, métodos y relaciones.\n\n### Criterios de aceptación\n- Diagrama refleja los 4 modelos del backend\n- Incluye relaciones, cardinalidad y tipos de datos\n- Formato imagen (PNG) subido a docs/",
        "assignee": "DanipSal",
        "label": f"{label_doc},sprint-2"
    },
    {
        "title": "Docs: Documento Final ABP",
        "body": "**Asignado a:** Daniela Salvo\n**Rama:** feature/issue-13\n\n### Descripción\nRedactar el Documento Final de Proyecto ABP en formato Word con normas APA. Incluir introducción, desarrollo, conclusiones y bibliografía.\n\n### Criterios de aceptación\n- Documento en formato Word (.docx)\n- Normas APA aplicadas\n- Subido a docs/",
        "assignee": "DanipSal",
        "label": f"{label_doc},sprint-2"
    },
    {
        "title": "Docs: Póster del Proyecto",
        "body": "**Asignado a:** Daniela Salvo\n**Rama:** feature/issue-14\n\n### Descripción\nDiseñar el Póster académico del proyecto EduTools para la presentación final. Incluir problema, solución, stack tecnológico, resultados y equipo.\n\n### Criterios de aceptación\n- Póster en formato imagen o PDF\n- Contenido sintético y visual\n- Subido a docs/",
        "assignee": "DanipSal",
        "label": f"{label_doc},sprint-2"
    },
    {
        "title": "Docs: Wiki del Repositorio",
        "body": "**Asignado a:** Jonathan Guillén\n**Rama:** feature/issue-09\n\n### Descripción\nCrear la Wiki en GitHub con: Home (tabla de contenidos), página de Historias de Usuario, página de Ceremonias Scrum (Daily, Review, Retro), enlaces a documentos. Markdown limpio sin exceso de iconos.\n\n### Criterios de aceptación\n- Wiki Home con tabla de contenidos navegable\n- Página de Historias de Usuario completa\n- Página de Ceremonias Scrum",
        "assignee": "JG-UNC",
        "label": f"{label_doc},sprint-2"
    },
    {
        "title": "Docs: Actualizar README.md",
        "body": "**Asignado a:** Jonathan Guillén\n**Rama:** feature/issue-10\n\n### Descripción\nAgregar instrucciones de instalación del Frontend y Backend, integrantes del equipo y roles, cómo ejecutar ambos servidores.\n\n### Criterios de aceptación\n- Instrucciones claras de instalación Front y Back\n- Listado de integrantes con roles\n- Comandos para ejecutar ambos entornos",
        "assignee": "JG-UNC",
        "label": f"{label_doc},sprint-2"
    }
]

for idx, issue in enumerate(issues, 1):
    print(f"Creating issue {idx}/14: {issue['title']}...")
    try:
        subprocess.run([
            "gh", "issue", "create",
            "-R", repo,
            "--title", issue["title"],
            "--body", issue["body"],
            "--assignee", issue["assignee"],
            "--milestone", milestone,
            "--label", issue["label"]
        ], check=True, encoding="utf-8")
    except subprocess.CalledProcessError as e:
        print(f"Error creating issue: {e}")

print("=== DONE ===")
