const express = require('express');
const router = express.Router();
const { param, body } = require('express-validator');
const controller = require('../controllers/users.controller');

router.get('/', controller.getUsers);
router.post(
  '/',
  [
    body('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    body('apellido_p', 'El apellido paterno es obligatorio.').not().isEmpty(),
    body('apellido_m', 'El apellido materno es obligatorio.').not().isEmpty(),
    body('telefono')
      .isInt()
      .withMessage('Sólo se aceptan números.')
      .isLength({ min: 10, max: 10 })
      .withMessage('El teléfono debe tener 10 caracteres.')
      .optional(),
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
    body('direccion', 'La dirección es obligatoria.').not().isEmpty(),
  ],
  controller.registerUser
);

module.exports = router;
