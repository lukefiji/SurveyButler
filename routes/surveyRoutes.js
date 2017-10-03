const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const requireCredits = require('../middleware/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

// Requiring model for tests (instead of pulling fire)
const Survey = mongoose.model('surveys');

module.exports = app => {
  app.post('/api/surveys/webhooks', (req, res) => {
    // Extract variables out of path
    const p = new Path('/api/surveys/:surveyId/:choice');

    // Start functional chain to process events
    const events = _.chain(req.body)
      // Map over array of incoming events
      .map(({ email, url }) => {
        // Get only URL pathname (after http://domain/...)
        // If Path.test() doesnt detect surveyId AND choice, it returns null
        const match = p.test(new URL(url).pathname);
        // Only return email, surveyId, and choice of events that match
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
      // Remove undefined events from array
      .compact()
      // Remove duplicate events of matching email AND surveyId
      .uniqBy('email', 'surveyId')
      // Returns value of processed array
      .value();

    console.log(events);

    res.send({});
  });

  // Creating a new survey
  app.post(
    '/api/surveys',
    requireLogin,
    requireCredits(1),
    async (req, res) => {
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

      // Send email via Mailer class
      const mailer = new Mailer(survey, surveyTemplate(survey));
      try {
        await mailer.send();
        await survey.save();

        // Update user
        req.user.credits -= 1;
        const user = await req.user.save();

        // Send new user model to update authReducer
        res.send(user);
      } catch (err) {
        // Unprocessable entity
        res.status(422).send(err);
      }
    }
  );
};
