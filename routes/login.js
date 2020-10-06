const express = require('express');
const router = express.Router();
const loginValidator = require('../validation/login');
const controller = require('../controllers/login.controller');

router.post('/', loginValidator, controller.login);

module.exports = router;
