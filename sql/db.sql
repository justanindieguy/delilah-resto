CREATE DATABASE delilah_resto CHARACTER SET utf8 COLLATE utf8_spanish_ci;
USE delilah_resto;

CREATE TABLE IF NOT EXISTS roles(
	id INT(2) UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL CHECK (nombre <> ""),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS users(
	id INT(11) UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(150) NOT NULL CHECK (nombre <> ""),
	apellido_p VARCHAR(150) NOT NULL CHECK (apellido_p <> ""),
	apellido_m VARCHAR (150) NOT NULL CHECK (apellido_m <> ""),
	telefono CHAR(10) DEFAULT NULL,
	email VARCHAR(150) NOT NULL CHECK (email <> ""),
	pass VARCHAR(500) NOT NULL CHECK (pass <> ""),
	direccion VARCHAR(500) NOT NULL CHECK (direccion <> ""),
	rol_id INT(2) UNSIGNED NOT NULL DEFAULT 1,
	PRIMARY KEY (id),
	FOREIGN KEY (rol_id)
		REFERENCES roles(id)
		ON DELETE CASCADE
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

CREATE TABLE IF NOT EXISTS payment_methods(
	id INT(2) UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL CHECK (nombre <> ""),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS deliveries(
	id INT(11) UNSIGNED AUTO_INCREMENT,
	usuario_id INT(11) UNSIGNED NOT NULL,
	estado_id INT(2) UNSIGNED NOT NULL DEFAULT 1,
	pago_id INT(2) UNSIGNED,
	fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (usuario_id)
		REFERENCES users(id)
		ON DELETE CASCADE,
	FOREIGN KEY (estado_id)
		REFERENCES statuses(id)
		ON DELETE CASCADE,
	FOREIGN KEY (pago_id)
		REFERENCES payment_methods(id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders(
	pedido_id INT(11) UNSIGNED,
	producto_id INT (11) UNSIGNED,
	cantidad INT(4) UNSIGNED NOT NULL CHECK (cantidad <> 0),
	PRIMARY KEY (pedido_id, producto_id),
	FOREIGN KEY (pedido_id)
		REFERENCES deliveries(id)
		ON DELETE CASCADE,
	FOREIGN KEY (producto_id)
		REFERENCES products(id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites(
	usuario_id INT(11) UNSIGNED,
	producto_id INT(11) UNSIGNED,
	PRIMARY KEY (usuario_id, producto_id),
	FOREIGN KEY (usuario_id)
		REFERENCES users(id)
		ON DELETE CASCADE,
	FOREIGN KEY (producto_id)
		REFERENCES products(id)
		ON DELETE CASCADE
);

-- Insertar roles --
INSERT INTO roles (nombre) VALUES ("Usuario");
INSERT INTO roles (nombre) VALUES ("Administrador");

-- Insertar estados --
INSERT INTO statuses (nombre) VALUES ("Confirmado");
INSERT INTO statuses (nombre) VALUES ("En preparación");
INSERT INTO statuses (nombre) VALUES ("En camino");
INSERT INTO statuses (nombre) VALUES ("Entregado");

-- Insertar metodos de pago. --
INSERT INTO payment_methods (nombre) VALUES ("Efectivo");
INSERT INTO payment_methods (nombre) VALUES ("Tarjeta de crédito");
INSERT INTO payment_methods (nombre) VALUES ("Tarjeta de débito");

-- Insertar productos --
INSERT
	INTO
	products(nombre, precio)
VALUES ("Bagel de Salmón", 50.00);

INSERT
	INTO
	products(nombre, precio)
VALUES ("Hamburguesa Clásica", 40.00);

INSERT
	INTO
	products(nombre, precio)
VALUES ("Sandwich veggie", 35.00);

INSERT
	INTO
	products(nombre, precio)
VALUES ("Ensalada veggie", 60.00);

INSERT
	INTO
	products(nombre, precio)
VALUES ("Focaccia", 60.00);

INSERT
	INTO
	products(nombre, precio)
VALUES ("Sandwich Focaccia", 50.00);