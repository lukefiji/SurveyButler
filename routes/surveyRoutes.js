const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const requireCredits = require('../middleware/requireCredits');

// Requiring model for tests (instead of pulling fire)
const Survey = mongoose.model('surveys');

module.exports = app => {
  // Creating a new survey
  app.post('/api/surveys', requireLogin, requireCredits(1), (req, res) => {
    // Pull content from request body
    const { title, subject, body, recipients } = req.body;

    // Create new Survey instance
    const survey = new Survey({
      title,
      subject,
      body,
      // Split comma-separated list of emails
      recipients: recipients.split(',').map(email => ({
        email: email.trim()
      })),
      // _id available on any Mongoose/Mongo model
      _user: req.user.id,
      dateSent: Date.now()
    });
  });
};
