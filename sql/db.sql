CREATE DATABASE delilah_resto CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE delilah_resto;

CREATE TABLE IF NOT EXISTS users(
	id INT(11) UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(150) NOT NULL CHECK (nombre <> ""),
	apellido_p VARCHAR(150) NOT NULL CHECK (apellido_p <> ""),
	apellido_m VARCHAR (150) NOT NULL CHECK (apellido_m <> ""),
	telefono CHAR(10) DEFAULT NULL,
	email VARCHAR(150) NOT NULL CHECK (email <> ""),
	pass VARCHAR(500) NOT NULL CHECK (pass <> ""),
	direccion VARCHAR(500) NOT NULL CHECK (direccion <> ""),
	admin BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS products(
	id INT(11) UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(150) NOT NULL CHECK (nombre <> ""),
	precio FLOAT(10, 2) UNSIGNED NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS statuses(
	id INT(2) UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL CHECK (nombre <> ""),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS shippings(
	id INT(11) UNSIGNED AUTO_INCREMENT,
	usuario_id INT(11) UNSIGNED NOT NULL,
	estado_id INT(2) UNSIGNED NOT NULL,
	fecha_hora DATE NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (usuario_id)
		REFERENCES users(id)
		ON DELETE CASCADE,
	FOREIGN KEY (estado_id)
		REFERENCES statuses(id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders(
	orden_id INT(11) UNSIGNED,
	producto_id INT (11) UNSIGNED,
	cantidad INT(4) UNSIGNED NOT NULL CHECK (cantidad <> 0),
	PRIMARY KEY (orden_id, producto_id),
	FOREIGN KEY (orden_id)
		REFERENCES shippings(id)
		ON DELETE CASCADE,
	FOREIGN KEY (producto_id)
		REFERENCES products(id)
		ON DELETE CASCADE
);

-- Insertar estados --
INSERT INTO statuses (nombre) VALUES ("Confirmado");
INSERT INTO statuses (nombre) VALUES ("En preparación");
INSERT INTO statuses (nombre) VALUES ("En camino");
INSERT INTO statuses (nombre) VALUES ("Entregado");

-- Insertar productos --
USE delilah_resto;

INSERT
	INTO
	products(nombre, precio)
VALUES ("Bagel de Salmón", 425.00);

INSERT
	INTO
	products(nombre, precio)
VALUES ("Hamburguesa Clásica", 350.00);

INSERT
	INTO
	products(nombre, precio)
VALUES ("Sandwich veggie", 310.00);

INSERT
	INTO
	products(nombre, precio)
VALUES ("Ensalada veggie", 340.00);

INSERT
	INTO
	products(nombre, precio)
VALUES ("Focaccia", 300.00);

INSERT
	INTO
	products(nombre, precio)
VALUES ("Sandwich Focaccia", 440.00);