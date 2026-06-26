Create database REMA;
Use REMA;

CREATE TABLE roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol ENUM('Alumno', 'Maestro', 'Coordinador') UNIQUE 
);


CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    contraseña varchar(15) not null,
    correo_institucional VARCHAR(100) UNIQUE NOT NULL,
    carrera VARCHAR(100) NOT NULL,
    id_rol INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE herramientas (
    id_herramienta INT PRIMARY KEY AUTO_INCREMENT, 
    nombre VARCHAR(100) NOT NULL,                  
    descripcion TEXT,                              
    stock INT,      
    disponibilidad boolean, 
    no_estanteria VARCHAR(50),                     
    carrera VARCHAR(100),                          
    solo_maestros BOOLEAN DEFAULT FALSE
);


CREATE TABLE solicitudes (
    id_solicitud INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT, 
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_devolucion DATE NOT NULL,
    estado ENUM('Pendiente', 'Aprobada', 'Rechazada', 'Devuelto') DEFAULT 'Pendiente', 
    id_coordinador INT NULL, 
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_coordinador) REFERENCES usuarios(id_usuario)
);

CREATE TABLE reportes (
    id_reporte INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitud INT,
    fecha_generado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT, 
    FOREIGN KEY (id_solicitud) REFERENCES solicitudes(id_solicitud)
);

INSERT INTO roles (nombre_rol) VALUES 
('Coordinador'), 
('Maestro'), 
('Alumno');

-- Estanteria 1
Insert into herramientas (nombre, descripcion, stock, disponibilidad, no_estanteria, carrera) Values 
("Torquímetro de raíz 1/2", 'Buen estado', 1, TRUE, "Estanteria 1", "Mecanica");
INSERT INTO herramientas (nombre, descripcion, stock, disponibilidad, no_estanteria, carrera, solo_maestros) VALUES 
("Manguera de aire", "Buen estado", 1, TRUE, "Estanteria 1", "Mecanica", FALSE),
("Pistola de impacto raiz 1/2", "Buen estado", 1, TRUE, "Estanteria 1", "Mecanica", FALSE),
("extractor de valvulas tipo sargento", "Buen estado", 1, TRUE, "Estanteria 1", "Mecanica", FALSE),
("cadena de metal", "Buen estado", 1, TRUE, "Estanteria 1", "Mecanica", FALSE),
("kit extractor de rotulas", "Buen estado", 1, TRUE, "Estanteria 1", "Mecanica", FALSE),
("Escaner automotriz Snapon", "Buen estado", 1, TRUE, "Estanteria 1", "Mecanica", TRUE);
-- Estanteria 2
INSERT INTO herramientas (nombre, descripcion, stock, disponibilidad, no_estanteria, carrera, solo_maestros) VALUES 
("Reloj comparador", "Buen estado", 1, TRUE, "Estanteria 2", "Mecanica", FALSE),
("KIT COPA ALEN", "Buen estado", 1, TRUE, "Estanteria 2", "Mecanica", FALSE),
("Test de fugas de cilindros automotriz", "Buen estado", 1, TRUE, "Estanteria 2", "Mecanica", FALSE),
("Bernier automotriz", "Buen estado", 4, TRUE, "Estanteria 2", "Mecanica", FALSE),
("Alexometro", "Buen estado", 1, TRUE, "Estanteria 2", "Mecanica", FALSE);
-- Estanteria 3
INSERT INTO herramientas (nombre, descripcion, stock, disponibilidad, no_estanteria, carrera, solo_maestros) VALUES 
("Reloj comparador", "Buen estado", 1, TRUE, "Estanteria 2", "Mecanica", FALSE),
("KIT COPA ALEN", "Buen estado", 1, TRUE, "Estanteria 2", "Mecanica", FALSE),
("Test de fugas de cilindros automotriz", "Buen estado", 1, TRUE, "Estanteria 2", "Mecanica", FALSE),
("Bernier automotriz", "Buen estado", 4, TRUE, "Estanteria 2", "Mecanica", FALSE),
("Alexometro", "Buen estado", 1, TRUE, "Estanteria 2", "Mecanica", FALSE);
-- Estanteria 4
INSERT INTO herramientas (nombre, descripcion, stock, disponibilidad, no_estanteria, carrera, solo_maestros) VALUES 
("Fuente de voltaje de 0 a 30 v", "Buen estado", 2, TRUE, "Estanteria 4", "Electronica y electricidad", FALSE),
("Barreno Milwaukee de raiz 1/2", "Buen estado, alumnos traen sus brocas", 1, TRUE, "Estanteria 4", "Mecanica, electricidad , electronica", FALSE),
("Pulidora milwauke de 4,5 pulgadas", "Buen estado, alumnos traen discos de pulir o desbaste", 3, TRUE, "Estanteria 4", "Mecanica y electricidad", FALSE),
("Pulidora bosch de 4,5 pulgadas", "Buen estado, alumnos traen discos de pulir o desbaste", 1, TRUE, "Estanteria 4", "Mecanica y electricidad", FALSE),
("Caladora Milwauke", "Buen estado, alumnos traen la cierra.", 1, TRUE, "Estanteria 4", "Mecanica y electricidad", FALSE),
("Extractor de valvulas estuche rojo en kit", "Buen estado", 1, TRUE, "Estanteria 4", "Mecanica", FALSE),
("Extractor de resortes caja roja de metal", "Buen estado", 1, TRUE, "Estanteria 4", "Mecanica", FALSE),
("KIT COPAS Automotrices de raiz 3/4 varias medidas", "Buen estado", 1, TRUE, "Estanteria 4", "Mecanica", FALSE);
-- Estanteria 5
INSERT INTO herramientas (nombre, descripcion, stock, disponibilidad, no_estanteria, carrera, solo_maestros) VALUES 
("Torre para Automovil 3 toneladas", "Buen estado", 40, TRUE, "Estanteria 5", "Mecanica", FALSE),
("Torre para Automovil 6 toneladas", "Buen estado", 4, TRUE, "Estanteria 5", "Mecanica", FALSE),
("Careta para soldar", "Buen estado", 12, TRUE, "Estanteria 5", "Mecanica y electricidad", FALSE),
("Careta protectora de pulir", "Buen estado", 2, TRUE, "Estanteria 5", "Mecanica y electricidad", FALSE),
("Llave de pernos", "Buen estado", 2, TRUE, "Estanteria 5", "Mecanica", FALSE),
("Sargento", "Buen estado", 4, TRUE, "Estanteria 5", "Mecanica", FALSE),
("extencion de soldadora 220v", "Buen estado", 3, TRUE, "Estanteria 5", "Mecanica y electricidad", FALSE);
-- Estanteria 6
INSERT INTO herramientas (nombre, descripcion, stock, disponibilidad, no_estanteria, carrera, solo_maestros) VALUES 
("Martillo de bola", "Buen estado", 3, TRUE, "Estanteria 6", "Mecanica", FALSE),
("Cinta metrica 30 metros", "Buen estado", 2, TRUE, "Estanteria 6", "Dibujo", FALSE),
("Serrucho", "Buen estado", 1, TRUE, "Estanteria 6", "Electricidad", FALSE),
("Calibrador de alambre de cobre", "Buen estado", 1, TRUE, "Estanteria 6", "Electricidad", FALSE);

Select * from herramientas;

Insert into usuarios (nombre, contraseña, correo_institucional, carrera, id_rol) values ("REMA","prototipo12", "supportrema@gmail.com", "Admin", 1);

Select * from usuarios;


Insert into usuarios (nombre,contraseña, correo_institucional, carrera, id_rol) values ("Maestro/a ","maestros", "educacionvirtual@emilianisomascos.edu.gt", "Maestros", 2);

Insert into usuarios (nombre,contraseña,  correo_institucional, carrera, id_rol) values ("Clarence", "123456","clarence.hernandez@emilianisomascos.edu.gt", "Computación", 3);