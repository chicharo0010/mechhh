CREATE DATABASE IF NOT EXISTS mech2;
USE mech2;

CREATE TABLE `persona` (
  `id_persona` INT NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(30) NOT NULL,
  `correo` VARCHAR(50) NOT NULL,
  `contraseña` VARCHAR(255) NOT NULL,  -- Cambio: almacenamiento de contraseña hasheada
  `tipo_usuario` ENUM('cliente', 'mecanico') NOT NULL,  -- Cambio: campo de tipo de usuario
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `vehiculo` (
  `id_vehiculo` INT NOT NULL AUTO_INCREMENT,
  `id_persona` INT NOT NULL,         -- ID del mecánico que atiende el vehículo
  `correo_u` VARCHAR(50) NOT NULL,   -- Correo del cliente asociado al vehículo
  `marca` VARCHAR(40) NOT NULL,
  `modelo` VARCHAR(30) NOT NULL,
  `placa` VARCHAR(10) NOT NULL,
  `año` YEAR NOT NULL,               -- Año del vehículo
  `motivo` ENUM('mantenimiento', 'reparacion', 'otro') NOT NULL,  -- Motivo del registro
  `estado` ENUM('activo', 'inactivo', 'en reparación') NOT NULL,  -- Estado del vehículo
  PRIMARY KEY (`id_vehiculo`),
  KEY `id_persona` (`id_persona`), -- Índice para `id_persona`
  KEY `correo_u` (`correo_u`),     -- Índice para `correo_u`
  CONSTRAINT `vehiculo_ibfk_1` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`), -- Relación con el mecánico
  CONSTRAINT `vehiculo_ibfk_2` FOREIGN KEY (`correo_u`) REFERENCES `persona` (`correo`)          -- Relación con el cliente
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `marcas` (
  `idmar` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idmar`),
  UNIQUE KEY `nombre` (`nombre`)
);

CREATE TABLE `modelos` (
  `ModeloID` INT AUTO_INCREMENT,
  `NombreModelo` VARCHAR(50) DEFAULT NULL,
  `MarcaID` INT DEFAULT NULL,
  PRIMARY KEY (`ModeloID`),
  CONSTRAINT `modelos_ibfk_1` FOREIGN KEY (`MarcaID`) REFERENCES `marcas` (`idmar`)
);

CREATE TABLE `repuestos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(40) NOT NULL,
  `precio` DECIMAL(10, 2) NOT NULL,  -- Cambio: Usamos DECIMAL para precios
  `categoria` ENUM('motor', 'carroceria', 'mecanica') NOT NULL  -- Cambio: categoría de repuesto
);
CREATE TABLE `carrito` (
  `id_carrito` INT AUTO_INCREMENT PRIMARY KEY,
  `id_persona` INT NOT NULL,
  `id_repuesto` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `total` DECIMAL(10, 2) NOT NULL,  -- Cambio: usamos DECIMAL para cálculos con precios
  `categoria` ENUM('motor', 'carroceria', 'mecanica') NOT NULL,  -- Cambio: añadimos categoría de repuesto
  FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`),
  FOREIGN KEY (`id_repuesto`) REFERENCES `repuestos` (`id`),
  INDEX (`id_persona`)  -- Índice para mejorar consultas
);

CREATE TABLE `registro` (
  `id_persona` INT NOT NULL,         -- ID del mecánico que realiza el registro
  `id_vehiculo` INT NOT NULL,        -- ID del vehículo en cuestión
  `bitacora` TEXT NOT NULL,          -- Detalles de la reparación o acción realizada
  `fecha` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora del registro
  `tipo_registro` ENUM('reparacion', 'mantenimiento', 'revision', 'otros') NOT NULL, -- Tipo de acción realizada
  FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`),   -- Relación con la tabla `persona` para el mecánico
  FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculo` (`id_vehiculo`), -- Relación con la tabla `vehiculo`
  INDEX (`id_persona`, `id_vehiculo`)  -- Índice para mejorar el rendimiento de las consultas
);


-- Insertar marcas
INSERT INTO marcas (nombre) VALUES
('Audi'),
('BMW'),
('Ford'),
('Toyota');

-- Insertar modelos
INSERT INTO modelos (NombreModelo, MarcaID) VALUES
('Q5', 1),
('X5', 2),
('Mustang', 3),
('Camry', 4);

-- Insertar repuestos
INSERT INTO repuestos (nombre, precio, categoria) VALUES
('Piston', 380.00, 'motor'),
('Biela', 380.00, 'motor'),
('Manilla', 150.00, 'carroceria'),
('Bateria', 2399.00, 'mecanica');


