const { body } = require('express-validator');

const register = [
  body('nombre')
    .not()
    .isEmpty()
    .withMessage('El nombre es obligatorio.')
    .isLength({ min: 1, max: 50 })
    .withMessage('El nombre tiene una longitud máxima de 50 caracteres.'),
  body('apellido_p')
    .not()
    .isEmpty()
    .withMessage('El apellido paterno es obligatorio.')
    .isLength({ min: 1, max: 50 })
    .withMessage(
      'El apellido paterno tiene una longitud máxima de 50 caracteres.'
    ),
  body('apellido_m')
    .not()
    .isEmpty()
    .withMessage('El apellido materno es obligatorio.')
    .isLength({ min: 1, max: 50 })
    .withMessage(
      'El apellido materno tiene una longitud máxima de 50 caracteres.'
    ),
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
  body('direccion')
    .not()
    .isEmpty()
    .withMessage('La dirección es obligatoria.')
    .isLength({ min: 1, max: 150 })
    .withMessage('La direccion tiene una longitud máxima de 150 caracteres.'),
];

const update = [
  body('nombre', 'El nombre tiene una longitud máxima de 50 caracteres.')
    .isLength({ min: 1, max: 50 })
    .optional(),
  body(
    'apellido_p',
    'El apellido paterno tiene una longitud máxima de 50 caracteres.'
  )
    .isLength({ min: 1, max: 50 })
    .optional(),
  body(
    'apellido_m',
    'El apellido materno tiene una longitud máxima de 50 caracteres'
  )
    .isLength({ min: 1, max: 50 })
    .optional(),
  body('telefono')
    .isInt()
    .withMessage('Solo se aceptan números.')
    .isLength({ min: 10, max: 10 })
    .withMessage('El telefono debe tener 10 caracteres.')
    .optional(),
  body('email', 'Debes ingresar un email válido.').isEmail().optional(),
  body(
    'pass',
    'La contraseña debe tener una longitud mínima de 6 y máxima de 15.'
  )
    .isLength({ min: 6, max: 15 })
    .optional(),
  body(
    'direccion',
    'La direccion tiene una longitud máxima de 150 caracteres.'
  )
    .isLength({ min: 1, max: 150 })
    .optional(),
];

module.exports = { register, update };
