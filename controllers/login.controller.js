const { TOKEN_SECRET } = process.env;
const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');
const { SERVER_ERROR_MSG } = require('../utils/messages');
const jwt = require('jsonwebtoken');
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

module.exports = { login };
