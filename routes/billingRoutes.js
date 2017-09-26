const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = app => {
  app.post('/api/stripe', (req, res) => {
    // req.body comes from body-parser
    console.log(req.body);
  });
};
