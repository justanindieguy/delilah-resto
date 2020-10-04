CREATE DATABASE delilah_resto;
USE delilah_resto;

CREATE TABLE IF NOT EXISTS users(
	id INT(11) UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(150) NOT NULL CHECK (nombre <> ""),
	apellido_p VARCHAR(150) NOT NULL CHECK (apellido_p <> ""),
	apellido_m VARCHAR (150) NOT NULL CHECK (apellido_m <> ""),
	telefono CHAR(10) DEFAULT NULL,
	email VARCHAR(150) NOT NULL CHECK (email <> ""),
	pass VARCHAR(500) NOT NULL CHECK (pass <> ""),
	admin BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS products(
	id INT(11) UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(150) NOT NULL CHECK (nombre <> ""),
	price DOUBLE(4, 2) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS statuses(
	id INT(2) UNSIGNED AUTO_INCREMENT,
	nombre VARCHAR(50) NOT NULL CHECK (nombre <> ""),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS addresses(
	id INT(11) UNSIGNED AUTO_INCREMENT,
	usuario_id INT(11) UNSIGNED,
	colonia VARCHAR(100) NOT NULL CHECK (colonia <> ""),
	no_exterior VARCHAR(4) NOT NULL CHECK (no_exterior <> ""),
	no_interior VARCHAR(4) DEFAULT NULL,
	codigo_postal CHAR(5) NOT NULL CHECK (codigo_postal <> ""),
	PRIMARY KEY (id),
	FOREIGN KEY (usuario_id)
		REFERENCES users(id)
		ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders(
	id INT(11) UNSIGNED AUTO_INCREMENT,
	usuario_id INT(11) UNSIGNED,
	estado_id INT(2) UNSIGNED,
	fecha_hora DATE NOT NULL,
	total_orders DOUBLE(6, 2) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (usuario_id)
		REFERENCES users(id)
		ON DELETE SET NULL,
	FOREIGN KEY (estado_id)
		REFERENCES statuses(id)
		ON DELETE RESTRICT
);
