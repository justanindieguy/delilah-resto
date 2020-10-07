const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = process.env;

module.exports = function (req, res, next) {
  const token = req.header('auth-token');

  if (!token) return res.status(401).json({ message: 'Acceso denegado.' });

  try {
    const verified = jwt.verify(token, TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'El token no es válido.' });
  }
};
