const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');
const { SERVER_ERROR_MSG } = require('../utils/messages');
const sequelize = require('../database/database');
const User = require('../models/User');

function getUsers(req, res) {
  res.send('Getting all the users.');
}

function registerUser(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { email } = req.body;
    const emailExists = sequelize.query(
      `SELECT * FROM users WHERE email=${req.body.email}`
    );
  } catch (err) {
    return res.status(500).json({ message: SERVER_ERROR_MSG });
  }

  return res.status(200).json(req.body);
}

module.exports = { getUsers, registerUser };
