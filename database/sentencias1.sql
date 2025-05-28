-- PASO 1 CREAR TABLAS
-- PASO 1 CREAR TABLAS
-- PASO 1 CREAR TABLAS
-- PASO 1 CREAR TABLAS

-- Tabla de usuarios
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- texto plano (solo para pruebas)
    google_id VARCHAR(255) UNIQUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de cursos
CREATE TABLE curso (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria_id INT REFERENCES categoria(id),
    precio NUMERIC(6,2) NOT NULL,
    horas INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'activo',
    imagen_url VARCHAR(255)
);

-- Tabla de módulos
CREATE TABLE modulo (
    id SERIAL PRIMARY KEY,
    curso_id INT NOT NULL REFERENCES curso(id),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    orden INT NOT NULL
);

-- Tabla de subtemas
CREATE TABLE subtema (
    id SERIAL PRIMARY KEY,
    modulo_id INT NOT NULL REFERENCES modulo(id),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    orden INT NOT NULL
);

-- Tabla de materiales
CREATE TABLE material (
    id SERIAL PRIMARY KEY,
    subtema_id INT NOT NULL REFERENCES subtema(id),
    tipo VARCHAR(20) NOT NULL, -- pdf, ppt, video
    url VARCHAR(255) NOT NULL,
    descripcion VARCHAR(255)
);

-- Tabla de exámenes
CREATE TABLE examen (
    id SERIAL PRIMARY KEY,
    modulo_id INT NOT NULL REFERENCES modulo(id),
    nombre VARCHAR(150) NOT NULL,
    porcentaje_aprob INT DEFAULT 60
);

-- Tabla de preguntas
CREATE TABLE pregunta (
    id SERIAL PRIMARY KEY,
    examen_id INT NOT NULL REFERENCES examen(id),
    texto TEXT NOT NULL
);

-- Tabla de respuestas
CREATE TABLE respuesta (
    id SERIAL PRIMARY KEY,
    pregunta_id INT NOT NULL REFERENCES pregunta(id),
    texto TEXT NOT NULL,
    es_correcta BOOLEAN NOT NULL
);

-- Tabla de inscripciones
CREATE TABLE inscripcion (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuario(id),
    curso_id INT NOT NULL REFERENCES curso(id),
    estado VARCHAR(20) DEFAULT 'pendiente', -- pendiente, comprado
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pagos
CREATE TABLE pago (
    id SERIAL PRIMARY KEY,
    inscripcion_id INT NOT NULL REFERENCES inscripcion(id),
    metodo VARCHAR(20) NOT NULL, -- visa, yape, transferencia
    monto NUMERIC(6,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'pendiente' -- pendiente, completado
);

-- Tabla de certificados
CREATE TABLE certificado (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuario(id),
    curso_id INT NOT NULL REFERENCES curso(id),
    url_pdf VARCHAR(255) NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    horas INT NOT NULL
);

-- PASO 2 INSERTAR DATOS DE PRUEBA, COMPLETE LOS DEL CURSO 1  TABLAS

INSERT INTO modulo (curso_id, nombre, descripcion, orden)
VALUES (
  1, -- Cambia por el id real del curso
  'Módulo 1: Introducción',
  'Introducción a la gestión administrativa.',
  1
);


INSERT INTO subtema (modulo_id, nombre, descripcion, orden)
VALUES (
  1, -- Cambia por el id real del módulo
  'Subtema 1: Conceptos básicos',
  'Definición y conceptos clave.',
  1
);


INSERT INTO material (subtema_id, tipo, url, descripcion)
VALUES
  (1, 'pdf', 'https://www.africau.edu/images/default/sample.pdf', 'Manual PDF'),
  (1, 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Video introductorio');


  --  PASO 3 AÑADI CATEGORIAS

INSERT INTO categoria (nombre) VALUES
('Informática'),
('Salud'),
('Finanzas'),
('Educación'),
('Ingeniería'),
('Marketing'),
('Idiomas'),
('Recursos Humanos'),
('Logística'),
('Seguridad Ciudadana');




--- POASO 4 INSERCION DATOS  A  A MODULO, SUBTEMA Y MATERIAL A 3 CURSOS. 
-- INSERCION DE DATOS TABLAS
-- Para "Gestión Administrativa" (id=1)
INSERT INTO modulo (curso_id, nombre, descripcion, orden) VALUES
(1, 'Introducción a la gestión', 'Conceptos básicos de gestión administrativa.', 1),
(1, 'Procesos administrativos', 'Ciclo y herramientas administrativas.', 2),
(1, 'Gestión documental', 'Manejo de documentos y archivos.', 3);

-- Para "Programación en Python" (id=2)
INSERT INTO modulo (curso_id, nombre, descripcion, orden) VALUES
(2, 'Fundamentos de Python', 'Sintaxis y variables.', 1),
(2, 'Estructuras de control', 'Condicionales y bucles.', 2),
(2, 'Funciones y módulos', 'Definición y uso de funciones.', 3);

-- Para "Primeros Auxilios" (id=3)
INSERT INTO modulo (curso_id, nombre, descripcion, orden) VALUES
(3, 'Evaluación inicial', 'Cómo evaluar una emergencia.', 1),
(3, 'Atención de heridas', 'Tratamiento básico de heridas.', 2),
(3, 'RCP y emergencias', 'Reanimación y manejo de emergencias graves.', 3);


-- Para el primer módulo de "Gestión Administrativa" (id=1, módulo orden=1)
INSERT INTO subtema (modulo_id, nombre, descripcion, orden) VALUES
((SELECT id FROM modulo WHERE curso_id=1 AND orden=1), 'Definición de gestión', '¿Qué es la gestión administrativa?', 1),
((SELECT id FROM modulo WHERE curso_id=1 AND orden=1), 'Importancia', 'Importancia en las organizaciones.', 2);

-- Para el primer módulo de "Programación en Python" (id=2, módulo orden=1)
INSERT INTO subtema (modulo_id, nombre, descripcion, orden) VALUES
((SELECT id FROM modulo WHERE curso_id=2 AND orden=1), 'Variables en Python', 'Declaración y tipos de variables.', 1),
((SELECT id FROM modulo WHERE curso_id=2 AND orden=1), 'Operadores', 'Operadores aritméticos y lógicos.', 2);

-- Para el primer módulo de "Primeros Auxilios" (id=3, módulo orden=1)
INSERT INTO subtema (modulo_id, nombre, descripcion, orden) VALUES
((SELECT id FROM modulo WHERE curso_id=3 AND orden=1), 'Seguridad de la escena', 'Evaluar riesgos antes de actuar.', 1),
((SELECT id FROM modulo WHERE curso_id=3 AND orden=1), 'Valoración primaria', 'ABC de la emergencia.', 2);


-- Para el primer subtema de "Gestión Administrativa"
INSERT INTO material (subtema_id, tipo, url, descripcion) VALUES
((SELECT id FROM subtema WHERE nombre='Definición de gestión' AND modulo_id=(SELECT id FROM modulo WHERE curso_id=1 AND orden=1)), 'pdf', 'https://ejemplo.com/gestion.pdf', 'Documento sobre gestión administrativa'),
((SELECT id FROM subtema WHERE nombre='Definición de gestión' AND modulo_id=(SELECT id FROM modulo WHERE curso_id=1 AND orden=1)), 'video', 'https://ejemplo.com/gestion.mp4', 'Video introductorio');

-- Para el primer subtema de "Programación en Python"
INSERT INTO material (subtema_id, tipo, url, descripcion) VALUES
((SELECT id FROM subtema WHERE nombre='Variables en Python' AND modulo_id=(SELECT id FROM modulo WHERE curso_id=2 AND orden=1)), 'pdf', 'https://ejemplo.com/python-variables.pdf', 'Guía de variables en Python'),
((SELECT id FROM subtema WHERE nombre='Variables en Python' AND modulo_id=(SELECT id FROM modulo WHERE curso_id=2 AND orden=1)), 'video', 'https://ejemplo.com/python-variables.mp4', 'Video sobre variables');

-- Para el primer subtema de "Primeros Auxilios"
INSERT INTO material (subtema_id, tipo, url, descripcion) VALUES
((SELECT id FROM subtema WHERE nombre='Seguridad de la escena' AND modulo_id=(SELECT id FROM modulo WHERE curso_id=3 AND orden=1)), 'pdf', 'https://ejemplo.com/auxilios-seguridad.pdf', 'Manual de seguridad en emergencias'),
((SELECT id FROM subtema WHERE nombre='Seguridad de la escena' AND modulo_id=(SELECT id FROM modulo WHERE curso_id=3 AND orden=1)), 'video', 'https://ejemplo.com/auxilios-seguridad.mp4', 'Video sobre seguridad de la escena');


-- PASO 5 POBLANDO CURSO 1. lo hice porque  cree primero el curso 1 pero poble los otros primero.
-- 1. Agrega un módulo
INSERT INTO modulo (curso_id, nombre, descripcion, orden)
VALUES (1, 'Introducción a la gestión', 'Conceptos básicos de gestión administrativa.', 1);

-- 2. Agrega un subtema
INSERT INTO subtema (modulo_id, nombre, descripcion, orden)
VALUES (
  (SELECT id FROM modulo WHERE curso_id=1 AND orden=1 LIMIT 1),
  'Definición de gestión',
  '¿Qué es la gestión administrativa?',
  1
);

-- 6. Agrega un material / revisar
INSERT INTO material (subtema_id, tipo, url, descripcion)
VALUES (
  (SELECT id FROM subtema WHERE modulo_id=(SELECT id FROM modulo WHERE curso_id=1 AND orden=1 LIMIT 1) AND orden=1 LIMIT 1),
  'pdf',
  'https://ejemplo.com/gestion.pdf',
  'Documento sobre gestión administrativa'
);

--7. AÑADIR RESTRICCION PARA CURSO UNICO POR USUARIO
ALTER TABLE inscripcion ADD CONSTRAINT unique_usuario_curso UNIQUE (usuario_id, curso_id);
