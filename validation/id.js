const { ONLY_INT_MSG } = require('../utils/messages');
const { param } = require('express-validator');

const id = [param('id', ONLY_INT_MSG).isInt()];

module.exports = id;
