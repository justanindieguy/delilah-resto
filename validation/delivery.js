const { body } = require('express-validator');
const validator = require('validator');

const createDelivery = [
  body('pago_id')
    .isInt({ min: 1, max: 3 })
    .withMessage('Sólo se aceptan números enteros dentro del rango 1-3.')
    .not()
    .isEmpty()
    .withMessage('El campo pago_id es obligatorio.'),
  body('ordenes').custom((deliveries, { req }) => {
    if (!deliveries)
      throw new Error('El campo ordenes debe ser un arreglo de objetos.');

    for (let delivery of deliveries) {
      if (!delivery.producto_id)
        throw new Error('El campo producto_id es obligatorio.');

      if (!delivery.cantidad)
        throw new Error('El campo cantidad es obligatorio.');

      if (!validator.isInt(String(delivery.producto_id)))
        throw new Error('El ID del producto debe ser un número entero.');

      if (!validator.isInt(String(delivery.cantidad)))
        throw new Error('La cantidad debe ser un número entero.');
    }

    return true;
  }),
];

const updateDelivery = [
  body('estado_id', 'Sólo se aceptan números enteros dentro del rango 1-4.')
    .isInt({ min: 1, max: 4 })
    .optional(),
];

module.exports = { createDelivery, updateDelivery };
