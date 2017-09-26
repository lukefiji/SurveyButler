const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const requireLogin = require('../middleware/requireLogin'); // Middleware

module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    // req.body comes from body-parser
    const charge = await stripe.charges.create({
      amount: 500,
      currency: 'usd',
      description: '$5 for 5 SurveyButler credits',
      source: req.body.id
    });

    // User model comes from passport as req.user
    req.user.credits += 5;
    // Save model and return updated model
    const user = await req.user.save();
    // Send back updated model to client's action creator
    res.send(user);
  });
};
