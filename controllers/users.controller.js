const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');
const { SERVER_ERROR_MSG } = require('../utils/messages');
const { getInsertSentences } = require('../utils/utils');
const bcrypt = require('bcryptjs');
const sequelize = require('../database/database');
const User = require('../models/User');

function getUsers(req, res) {
  res.send('Getting all the users.');
}

async function registerUser(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    // Convert number into string, so sequelize will accept the query.
    if (req.body.telefono) req.body.telefono = String(req.body.telefono);

    const { email, telefono } = req.body;
    const emailExists = await sequelize.query(
      `SELECT * FROM users WHERE email="${email}"`,
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
        `SELECT * FROM users WHERE telefono="${telefono}"`,
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

    const [newUser] = await sequelize.query(
      `SELECT * FROM users WHERE id=${id[0]}`,
      {
        type: QueryTypes.SELECT,
        model: User,
        mapToModel: true,
      }
    );

    return res.status(200).json({
      message: 'Nuevo usuario registrado.',
      data: {
        nombre: `${newUser.nombre} ${newUser.apellido_p} ${newUser.apellido_m}`,
        telefono: newUser.telefono,
        email: newUser.email,
        direccion: newUser.direccion,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

module.exports = { getUsers, registerUser };
