const express = require('express');
const router = express.Router();
const validator = require('../validation/user');
const token = require('../validation/verifyToken');
const controller = require('../controllers/users.controller');

router.get('/', token.verifyToken, token.checkIfIsAdmin, controller.getUsers);

router.post('/', validator.register, controller.registerUser);

router.get('/myUser', token.verifyToken, controller.getOneUser);

router.patch(
  '/myUser',
  validator.update,
  token.verifyToken,
  controller.updateUser
);

module.exports = router;
