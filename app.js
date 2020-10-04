const express = require('express');
const bodyParser = require('body-parser');

// Importing routes.
const productsRoute = require('./routes/products');
const usersRoute = require('./routes/users');
const ordersRoute = require('./routes/orders');

const app = express();

app.use(bodyParser.json());

// Routes.
app.use('/api/v1/products', productsRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/orders', ordersRoute);

module.exports = app;
