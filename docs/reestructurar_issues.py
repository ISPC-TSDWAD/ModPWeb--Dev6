import subprocess
import os

os.environ["PATH"] += r";C:\Program Files\GitHub CLI"

repo = "ISPC-TSDWAD/ModPWeb--Dev6"

# Rename HUs
hus_to_rename = {
    36: "HU-06 - Autenticación Segura y JWT",
    37: "HU-07 - Gestión de Usuarios (CRUD)",
    38: "HU-08 - Persistencia de Recursos (CRUD)"
}

for issue_num, new_title in hus_to_rename.items():
    print(f"Updating {issue_num} to HU...")
    subprocess.run(["gh", "issue", "edit", str(issue_num), "-R", repo, "--title", new_title], check=True, encoding="utf-8")

# Update Tasks
tasks_to_update = {
    39: {
        "title": "Task: Integración Backend Sprint 2",
        "body": "**Asignado a:** Gonzalo Velasco\n\n### Descripción\n- Implementar JWT y proteger endpoints.\n- Completar y testear endpoints CRUD de Usuarios y Recursos en Django.\n\n*(Soporta las HU-06, HU-07 y HU-08)*",
        "assignees": "g0niii",
        "remove_label": "frontend",
        "add_label": "backend"
    },
    40: {
        "title": "Task: Integración Frontend Sprint 2",
        "body": "**Asignado a:** Ale Corva\n\n### Descripción\n- Conectar Angular a la API real (reemplazar mocks).\n- Armar la UI del CRUD en el Dashboard (botones editar/eliminar).\n- Manejo global de errores HTTP.\n\n*(Soporta las HU-07 y HU-08)*",
        "assignees": "Corval-LC",
        "add_label": "frontend"
    },
    41: {
        "title": "Task: QA, Formularios y Routing",
        "body": "**Asignado a:** Gerardo Romero\n\n### Descripción\n- Validaciones avanzadas en los Reactive Forms.\n- Proteger rutas con AuthGuard.\n- Pruebas de integración del Login.\n\n*(Soporta la HU-06)*",
        "assignees": "GerLR",
        "remove_label": "frontend",
        "add_label": "qa"
    },
    42: {
        "title": "Task: Entregables Documentales y Diagramas",
        "body": "**Asignado a:** Daniela Salvo\n\n### Descripción\n- Diseñar Póster del proyecto.\n- Redactar Documento Final ABP (Normas APA).\n- Diagrama de Clases UML del Backend.",
        "assignees": "DanipSal",
        "remove_label": "frontend",
        "add_label": "documentación"
    },
    43: {
        "title": "Task: Gestión Técnica, Wiki y Release",
        "body": "**Asignado a:** Jonathan Guillén\n\n### Descripción\n- Armar la Wiki en GitHub y el README.\n- Documento Técnico Sprint 2.\n- Code Review y Merge final a Main.",
        "assignees": "JG-UNC",
        "remove_label": "qa",
        "add_label": "documentación"
    }
}

for issue_num, data in tasks_to_update.items():
    print(f"Updating Task {issue_num}...")
    cmd = ["gh", "issue", "edit", str(issue_num), "-R", repo, "--title", data["title"], "--body", data["body"], "--add-assignee", data["assignees"]]
    if "add_label" in data:
        cmd.extend(["--add-label", data["add_label"]])
    if "remove_label" in data:
        cmd.extend(["--remove-label", data["remove_label"]])
    subprocess.run(cmd, check=True, encoding="utf-8")

# Close remaining issues
for issue_num in range(44, 50):
    print(f"Closing Issue {issue_num}...")
    subprocess.run(["gh", "issue", "close", str(issue_num), "-R", repo], check=True, encoding="utf-8")

print("=== DONE ===")
