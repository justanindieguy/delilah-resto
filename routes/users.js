const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validator = require('../validation/user');
const controller = require('../controllers/users.controller');

router.get('/', controller.getUsers);
router.post('/', validator.register, controller.registerUser);

module.exports = router;
