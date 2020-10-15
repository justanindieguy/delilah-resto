const { TOKEN_SECRET } = process.env;
const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');
const { SERVER_ERROR_MSG } = require('../utils/messages');
const { getInsertSentences, getUpdateSentences } = require('../utils/utils');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sequelize = require('../database/database');
const User = require('../models/User');

async function registerUser(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    // Convert number into string, so sequelize will accept the query.
    if (req.body.telefono) req.body.telefono = String(req.body.telefono);

    const { email, telefono } = req.body;
    const emailExists = await sequelize.query(
      `SELECT id, email, rol_id FROM users WHERE email="${email}"`,
      {
        type: QueryTypes.SELECT,
        model: User,
        mapToModel: true,
      }
    );

    // Check if email already exists.
    if (emailExists.length !== 0)
      return res.status(409).json({ error: 'El email ya está registrado.' });

    // Check if phone already exists.
    if (telefono) {
      const phoneExists = await sequelize.query(
        `SELECT id, email, rol_id FROM users WHERE telefono="${telefono}"`,
        {
          type: QueryTypes.SELECT,
          model: User,
          mapToModel: true,
        }
      );

      if (phoneExists.length !== 0)
        return res
          .status(409)
          .json({ error: 'El teléfono ya está registrado.' });
    }

    // Hash the password.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.pass, salt);
    req.body.pass = hashedPassword;

    const insertSentences = getInsertSentences(req.body);

    let id;
    if (!telefono) {
      id = await sequelize.query(
        `INSERT INTO users(nombre, apellido_p, apellido_m, email, pass, direccion) VALUES (${insertSentences.join(
          ', '
        )})`
      );
    } else {
      id = await sequelize.query(
        `INSERT INTO users(nombre, apellido_p, apellido_m, telefono, email, pass, direccion) VALUES (${insertSentences.join(
          ', '
        )})`
      );
    }

    const newUser = await selectUser(id[0]);

    return res
      .status(200)
      .json({ message: 'Nuevo usuario registrado.', data: newUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function getUsers(req, res) {
  try {
    const users = await sequelize.query(
      `SELECT id, CONCAT(nombre, " ", apellido_p, " ", apellido_m) AS nombre, telefono, email, direccion FROM users;`,
      { type: QueryTypes.SELECT, model: User, mapToModel: true }
    );

    if (users.length === 0)
      return res
        .status(404)
        .json({ error: 'Aún no hay usuarios registrados.' });

    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function getOneUser(req, res) {
  try {
    const { id: userId } = req.user;

    const user = await selectUser(userId);

    if (!user)
      return res.status(404).json({ error: 'Usuario no encontrado.' });

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function updateUser(req, res) {
  const errors = validationResult(req);
  const body = req.body;

  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array() });

  if (Object.keys(body).length === 0 && body.constructor === Object)
    return res
      .status(400)
      .json({ error: 'Se requiere por lo menos un campo para actualizar.' });

  try {
    const { id: userId } = req.user;
    const updateParams = {
      nombre: body.nombre,
      apellido_p: body.apellido_p,
      apellido_m: body.apellido_m,
      telefono: body.telefono ? String(body.telefono) : null,
      email: body.email,
      pass: body.pass,
      direccion: body.direccion,
    };

    if (updateParams.pass) {
      const salt = await bcrypt.genSalt(10);
      updateParams.pass = await bcrypt.hash(updateParams.pass, salt);
    }

    const setSentences = getUpdateSentences(updateParams);
    const [result] = await sequelize.query(
      `UPDATE users SET ${setSentences.join(', ')} WHERE id=${userId}`
    );

    if (result.affectedRows === 0)
      return res.status(409).json({ message: 'Nada que actualizar.' });

    const user = await selectUser(userId);

    return res
      .status(200)
      .json({ message: 'Usuario actualizado.', data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

async function selectUser(userId) {
  try {
    // prettier-ignore
    const [user] = await sequelize.query(
      `SELECT CONCAT(nombre, " ", apellido_p, " ", apellido_m) AS nombre, direccion, telefono, email FROM users WHERE id=${userId}`,
      { type: QueryTypes.SELECT, model: User, mapToModel: true }
    );

    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function login(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { email, pass } = req.body;

    // Checking if email exists.
    const [user] = await sequelize.query(
      `SELECT id, email, pass, rol_id FROM users WHERE email="${email}"`,
      {
        type: QueryTypes.SELECT,
      }
    );

    if (!user)
      return res
        .status(400)
        .json({ error: 'Usuario o contraseña incorrectos.' });

    // Check if password is correct.
    const validPass = await bcrypt.compare(pass, user.pass);

    if (!validPass)
      return res
        .status(400)
        .json({ error: 'Usuario o contraseña incorrectos.' });

    // Create and assign a token.
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        rol: user.rol_id,
      },
      TOKEN_SECRET
    );

    return res
      .status(200)
      .header('auth-token', token)
      .json({ message: 'Inicio de sesión exitoso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

module.exports = { getUsers, getOneUser, registerUser, updateUser, login };
