import subprocess
import os

os.environ["PATH"] += r";C:\Program Files\GitHub CLI"

repo = "ISPC-TSDWAD/ModPWeb--Dev6"

issues_to_rename = {
    36: "HU-06 - Backend: Autenticación JWT",
    37: "HU-07 - Backend: CRUD Usuarios completo",
    38: "HU-08 - Backend: CRUD Recursos completo con filtros",
    39: "HU-09 - Frontend: Conectar API real (reemplazar mocks)",
    40: "HU-10 - Frontend: UI de CRUD completo en Dashboard",
    41: "HU-11 - Frontend: Manejo de errores HTTP",
    42: "HU-12 - Frontend: Routing avanzado + AuthGuard",
    43: "HU-13 - QA: Validaciones avanzadas en formularios",
    44: "HU-14 - QA: Login real contra Backend JWT",
    45: "HU-15 - Docs: Diagrama de Clases del sistema",
    46: "HU-16 - Docs: Documento Final ABP",
    47: "HU-17 - Docs: Póster del Proyecto",
    48: "HU-18 - Docs: Wiki del Repositorio",
    49: "HU-19 - Docs: Actualizar README.md"
}

for issue_num, new_title in issues_to_rename.items():
    print(f"Renaming issue #{issue_num} to '{new_title}'...")
    try:
        subprocess.run([
            "gh", "issue", "edit", str(issue_num),
            "-R", repo,
            "--title", new_title
        ], check=True, encoding="utf-8")
    except subprocess.CalledProcessError as e:
        print(f"Error renaming issue #{issue_num}: {e}")

print("=== DONE RENAMING ===")
