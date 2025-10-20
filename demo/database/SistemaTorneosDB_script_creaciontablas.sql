-- ======================================
-- TABLA USUARIO (padre)
-- ======================================
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(100) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('ADMIN', 'PARTICIPANTE')) NOT NULL
);

-- ======================================
-- TABLA PARTICIPANTE (hijo)
-- ======================================
CREATE TABLE participante (
    id_participante SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    tipo_documento VARCHAR(20),
    numero_documento VARCHAR(20) UNIQUE NOT NULL,
    id_usuario INT UNIQUE NOT NULL,
    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);

-- ======================================
-- TABLA ADMINISTRADOR (hijo)
-- ======================================
CREATE TABLE administrador (
    id_admin SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL,
    FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE
);

-- ======================================
-- TABLA TORNEO
-- ======================================
CREATE TABLE torneo (
    id_torneo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    publicado BOOLEAN DEFAULT FALSE,
    id_admin INT NOT NULL,
    FOREIGN KEY (id_admin)
        REFERENCES administrador(id_admin)
        ON DELETE CASCADE
);

-- ======================================
-- TABLA COMPETENCIA
-- ======================================
CREATE TABLE competencia (
    id_competencia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL,
    cupo INT NOT NULL CHECK (cupo > 0),
    id_torneo INT NOT NULL,
    FOREIGN KEY (id_torneo)
        REFERENCES torneo(id_torneo)
        ON DELETE CASCADE
);

-- ======================================
-- TABLA INSCRIPCION (relación)
-- ======================================
CREATE TABLE inscripcion (
    id_inscripcion SERIAL PRIMARY KEY,
    fecha_inscripcion DATE NOT NULL,
    precio_pagado DECIMAL(10,2) NOT NULL CHECK (precio_pagado >= 0),
    id_participante INT NOT NULL,
    id_competencia INT NOT NULL,
    FOREIGN KEY (id_participante)
        REFERENCES participante(id_participante)
        ON DELETE CASCADE,
    FOREIGN KEY (id_competencia)
        REFERENCES competencia(id_competencia)
        ON DELETE CASCADE,
    CONSTRAINT un_participante_por_competencia UNIQUE (id_participante, id_competencia)
);
