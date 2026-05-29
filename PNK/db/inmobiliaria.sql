CREATE DATABASE IF NOT EXISTS inmobiliaria;
USE inmobiliaria;

CREATE TABLE IF NOT EXISTS gestores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    sexo ENUM('Masculino', 'Femenino', 'Otro') NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    certificado_pdf VARCHAR(255),
    estado BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS propiedades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    operacion VARCHAR(20) DEFAULT 'Venta',
    descripcion TEXT,
    banos INT DEFAULT 0,
    dormitorios INT DEFAULT 0,
    area_terreno DECIMAL(10,2) DEFAULT 0,
    area_construida DECIMAL(10,2) DEFAULT 0,
    precio_clp BIGINT DEFAULT 0,
    precio_uf DECIMAL(10,2) DEFAULT 0,
    comuna VARCHAR(100),
    provincia VARCHAR(100),
    sector VARCHAR(100),
    bodega BOOLEAN DEFAULT FALSE,
    estacionamiento INT DEFAULT 0,
    cocina_amoblada BOOLEAN DEFAULT FALSE,
    piscina BOOLEAN DEFAULT FALSE,
    imagenes TEXT,
    usuario_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES gestores(id) ON DELETE CASCADE
);

INSERT INTO gestores (rut, nombre_completo, fecha_nacimiento, correo, contrasena, sexo, telefono) 
VALUES ('11111111-1', 'Admin', '1990-01-01', 'admin@pnk.cl', '12345', 'Masculino', '912345678');