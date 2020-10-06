const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');
const { SERVER_ERROR_MSG } = require('../utils/messages');
const bcrypt = require('bcryptjs');
const sequelize = require('../database/database');

async function login(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { email, pass } = req.body;

    // Checking if email exists.
    const [user] = await sequelize.query(
      `SELECT email, pass FROM users WHERE email="${email}"`,
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

    return res.status(200).send('Logged in!');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }
}

module.exports = { login };
