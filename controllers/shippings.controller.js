function createShipping(req, res) {
  res.send("You're about to create a new shipping.");
}

function getShippings(req, res) {
  res.send('Getting all the orders.');
}

module.exports = { createShipping, getShippings };
