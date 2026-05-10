-- ============================================================
-- EduTools — Script SQL de Base de Datos
-- Motor: MySQL 8.x
-- Generado a partir del DER y los modelos de Django (Sprint 1)
-- ============================================================

-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS edutools_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE edutools_db;

-- ──────────────────────────────────────────────
-- Tabla: api_usuario
-- Extiende el modelo de autenticación de Django
-- con un campo de rol del sistema.
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_usuario (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    password        VARCHAR(128)    NOT NULL,
    last_login      DATETIME(6)     NULL,
    is_superuser    TINYINT(1)      NOT NULL DEFAULT 0,
    username        VARCHAR(150)    NOT NULL UNIQUE,
    first_name      VARCHAR(150)    NOT NULL DEFAULT '',
    last_name       VARCHAR(150)    NOT NULL DEFAULT '',
    email           VARCHAR(254)    NOT NULL DEFAULT '',
    is_staff        TINYINT(1)      NOT NULL DEFAULT 0,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    date_joined     DATETIME(6)     NOT NULL,
    rol             VARCHAR(20)     NOT NULL DEFAULT 'asesor'
        COMMENT 'Valores: admin | asesor | maquetador'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ──────────────────────────────────────────────
-- Tabla: api_categoria
-- Categoría principal de componentes pedagógicos
-- (CTA, Estándares, Multimedia, etc.)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_categoria (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)    NOT NULL UNIQUE,
    descripcion     LONGTEXT        NOT NULL DEFAULT (''),
    activa          TINYINT(1)      NOT NULL DEFAULT 1,
    creado_en       DATETIME(6)     NOT NULL,
    actualizado_en  DATETIME(6)     NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ──────────────────────────────────────────────
-- Tabla: api_asignatura
-- Materias académicas para clasificar recursos
-- (Matemáticas, Historia, Química, etc.)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_asignatura (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(100)    NOT NULL UNIQUE,
    descripcion     LONGTEXT        NOT NULL DEFAULT (''),
    activa          TINYINT(1)      NOT NULL DEFAULT 1,
    creado_en       DATETIME(6)     NOT NULL,
    actualizado_en  DATETIME(6)     NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ──────────────────────────────────────────────
-- Tabla: api_recurso
-- Recursos pedagógicos creados desde el Sandbox,
-- vinculados a categoría, asignatura y usuario.
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_recurso (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    titulo          VARCHAR(200)    NOT NULL,
    descripcion     LONGTEXT        NOT NULL DEFAULT (''),
    tipo            VARCHAR(20)     NOT NULL DEFAULT 'video'
        COMMENT 'Valores: video | acordeon | infografia | cuestionario | lectura | actividad',
    contenido       LONGTEXT        NOT NULL DEFAULT (''),
    url             VARCHAR(200)    NOT NULL DEFAULT '',
    activo          TINYINT(1)      NOT NULL DEFAULT 1,
    creado_en       DATETIME(6)     NOT NULL,
    actualizado_en  DATETIME(6)     NOT NULL,

    -- Foreign Keys
    categoria_id    INT             NOT NULL,
    asignatura_id   INT             NOT NULL,
    creado_por_id   INT             NOT NULL,

    CONSTRAINT fk_recurso_categoria
        FOREIGN KEY (categoria_id) REFERENCES api_categoria(id)
        ON DELETE RESTRICT      -- PROTECT en Django
        ON UPDATE CASCADE,

    CONSTRAINT fk_recurso_asignatura
        FOREIGN KEY (asignatura_id) REFERENCES api_asignatura(id)
        ON DELETE RESTRICT      -- PROTECT en Django
        ON UPDATE CASCADE,

    CONSTRAINT fk_recurso_usuario
        FOREIGN KEY (creado_por_id) REFERENCES api_usuario(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- Índices para búsquedas frecuentes
    INDEX idx_recurso_tipo (tipo),
    INDEX idx_recurso_categoria (categoria_id),
    INDEX idx_recurso_asignatura (asignatura_id),
    INDEX idx_recurso_creado_por (creado_por_id),
    INDEX idx_recurso_creado_en (creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ──────────────────────────────────────────────
-- Datos iniciales: Categorías por defecto
-- ──────────────────────────────────────────────
INSERT INTO api_categoria (nombre, descripcion, activa, creado_en, actualizado_en)
VALUES
    ('Llamados a la Acción (CTA)',  'Componentes de llamada a la acción',       1, NOW(), NOW()),
    ('Estándares de Diseño',        'Estándares visuales institucionales',       1, NOW(), NOW()),
    ('Recursos Multimedia',         'Contenido multimedia y audiovisual',        1, NOW(), NOW()),
    ('Herramientas Interactivas',   'Componentes interactivos H5P y LTI',       1, NOW(), NOW()),
    ('Evaluaciones',                'Recursos para evaluaciones y exámenes',     1, NOW(), NOW());


-- ──────────────────────────────────────────────
-- Datos iniciales: Asignaturas por defecto
-- ──────────────────────────────────────────────
INSERT INTO api_asignatura (nombre, descripcion, activa, creado_en, actualizado_en)
VALUES
    ('Matemáticas Avanzadas',   'Cálculo, álgebra y análisis matemático',   1, NOW(), NOW()),
    ('Historia Universal',      'Historia mundial y civilizaciones',        1, NOW(), NOW()),
    ('Química Orgánica',        'Fundamentos de química orgánica',          1, NOW(), NOW()),
    ('Programación III',        'Programación avanzada y estructuras',      1, NOW(), NOW());
