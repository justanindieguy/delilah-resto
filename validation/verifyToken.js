const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = process.env;

function verifyToken(req, res, next) {
  const token = req.header('auth-token');

  if (!token) return res.status(401).json({ message: 'Acceso denegado.' });

  try {
    const verified = jwt.verify(token, TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'El token no es válido.' });
  }
}

function checkIfIsAdmin(req, res, next) {
  // rol = 1 is for normal user.
  // rol = 2 is for administrator.

  const { rol } = req.user;

  if (rol === 2) {
    next();
  } else {
    return res.status(401).json({ message: 'Acceso denegado.' });
  }
}

module.exports = { verifyToken, checkIfIsAdmin };
