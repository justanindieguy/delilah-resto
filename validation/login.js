const { body } = require('express-validator');

const login = [
  body('email')
    .isEmail()
    .withMessage('Debes ingresar un email válido.')
    .not()
    .isEmpty()
    .withMessage('El email es obligatorio.'),
  body('pass')
    .isLength({ min: 6, max: 15 })
    .withMessage(
      'La contraseña debe tener una longitud mínima de 6 y máxima de 15.'
    )
    .not()
    .isEmpty()
    .withMessage('La contraseña es obligatoria.'),
];

module.exports = login;
