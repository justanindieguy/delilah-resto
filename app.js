const express = require('express');
const bodyParser = require('body-parser');

// Importing routes.
const productsRoute = require('./routes/products');
const usersRoute = require('./routes/users');
const deliveriesRoute = require('./routes/deliveries');
const loginRoute = require('./routes/login');
const favoritesRoute = require('./routes/favorites');

const app = express();

app.use(bodyParser.json());

// Routes.
app.use('/api/v1/products', productsRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/deliveries', deliveriesRoute);
app.use('/api/v1/login', loginRoute);
app.use('/api/v1/favorites', favoritesRoute);

module.exports = app;
