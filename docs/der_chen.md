# Diagrama Entidad-Relación — Notación Chen
## Proyecto: EduTools — Gestión y Sandbox Pedagógico

> **Nota metodológica:** Este diagrama sigue la **Notación Chen** (1976), donde:
> - Los **rectángulos** representan Entidades.
> - Los **óvalos/elipses** representan Atributos (subrayados si son clave primaria).
> - Los **rombos** representan Relaciones entre entidades.
> - Las líneas con cardinalidades (1, N) expresan la participación mínima/máxima.

---

## Diagrama DER — Notación Chen

![DER — Notación Chen — EduTools](DER.png)

> *Diagrama generado con herramienta externa. Los rectángulos representan entidades, los óvalos atributos (punteados = clave única/UK, sólidos = atributo regular), y los rombos naranjas las relaciones entre entidades.*


---



## Descripción de Entidades y Atributos

### 🟦 USUARIO
Extiende el modelo `AbstractUser` de Django. Representa a cualquier persona que interactúa con el sistema.

| Atributo | Tipo | Descripción |
|---|---|---|
| **<u>id</u>** | INT (PK) | Identificador único autoincremental |
| username | VARCHAR(150) | Nombre de usuario único |
| password | VARCHAR(128) | Contraseña hasheada |
| first_name | VARCHAR(150) | Nombre |
| last_name | VARCHAR(150) | Apellido |
| email | VARCHAR(254) | Correo electrónico |
| rol | VARCHAR(20) | `admin` \| `asesor` \| `maquetador` |
| is_active | BOOLEAN | Estado activo/inactivo |
| date_joined | DATETIME | Fecha de alta en el sistema |

### 🟦 CATEGORIA
Clasificación principal de los componentes pedagógicos. Un recurso siempre pertenece a exactamente una categoría.

| Atributo | Tipo | Descripción |
|---|---|---|
| **<u>id</u>** | INT (PK) | Identificador único |
| nombre | VARCHAR(100) | Nombre único de la categoría |
| descripcion | TEXT | Descripción de la categoría |
| activa | BOOLEAN | Si la categoría está activa |
| creado_en | DATETIME | Timestamp de creación |
| actualizado_en | DATETIME | Timestamp de última modificación |

### 🟦 ASIGNATURA
Materia académica asociada a cada recurso pedagógico para organizar el contenido por área de conocimiento.

| Atributo | Tipo | Descripción |
|---|---|---|
| **<u>id</u>** | INT (PK) | Identificador único |
| nombre | VARCHAR(100) | Nombre único de la asignatura |
| descripcion | TEXT | Descripción de la materia |
| activa | BOOLEAN | Si la asignatura está activa |
| creado_en | DATETIME | Timestamp de creación |
| actualizado_en | DATETIME | Timestamp de última modificación |

### 🟦 RECURSO
Entidad central del sistema. Representa un componente pedagógico interactivo creado desde el Sandbox.

| Atributo | Tipo | Descripción |
|---|---|---|
| **<u>id</u>** | INT (PK) | Identificador único |
| titulo | VARCHAR(200) | Título del recurso |
| descripcion | TEXT | Descripción del recurso |
| tipo | VARCHAR(20) | `video` \| `acordeon` \| `infografia` \| `cuestionario` \| `lectura` \| `actividad` |
| contenido | TEXT | HTML o texto del contenido |
| url | VARCHAR(200) | Enlace de destino |
| activo | BOOLEAN | Estado activo/inactivo |
| creado_en | DATETIME | Timestamp de creación |
| actualizado_en | DATETIME | Timestamp de última modificación |

---

## Relaciones (Notación Chen)

| Rombo | Entidades | Cardinalidad | Semántica |
|---|---|:---:|---|
| **CREA** | USUARIO → RECURSO | 1 : N | Un usuario puede crear muchos recursos. Un recurso es creado por exactamente un usuario. |
| **CLASIFICA** | CATEGORIA → RECURSO | 1 : N | Una categoría agrupa muchos recursos. Un recurso pertenece a exactamente una categoría. |
| **PERTENECE** | ASIGNATURA → RECURSO | 1 : N | Una asignatura tiene muchos recursos. Un recurso es de exactamente una asignatura. |

---

> 📎 Ver también: [Modelo Relacional](modelo_relacional.md) | [Script SQL](sql/script_database.sql)
