const jwt = require('jsonwebtoken');
const sequelize = require('../database/database');
const { QueryTypes } = require('sequelize');
const { TOKEN_SECRET } = process.env;

async function verifyToken(req, res, next) {
  const token = req.header('auth-token');

  if (!token) return res.status(401).json({ message: 'Acceso denegado.' });

  try {
    const verified = jwt.verify(token, TOKEN_SECRET);

    const [userExists] = await sequelize.query(
      `SELECT id, email FROM users WHERE id=${verified.id}`,
      {
        type: QueryTypes.SELECT,
      }
    );

    // In case the user has been deleted.
    if (!userExists)
      return res.status(404).json({ message: 'Usuario no encontrado.' });

    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'El token no es válido.' });
  }
}

function checkIfIsAdmin(req, res, next) {
  const { loggedInAs } = req.user;

  if (loggedInAs === 'Administrador') {
    next();
  } else {
    return res.status(401).json({ message: 'Acceso denegado.' });
  }
}

module.exports = { verifyToken, checkIfIsAdmin };
