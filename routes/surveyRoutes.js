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
  app.get('/api/surveys', requireLogin, async (req, res) => {
    // Query for surveys created by current user
    const surveys = await Survey.find({ _user: req.user.id })
      // Include or exclude fields - a query "projection"
      // - Exclude recipients
      .select({ recipients: false });

    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.redirect('/thanks');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    // Extract variables out of path
    const p = new Path('/api/surveys/:surveyId/:choice');

    // Start functional chain to process events
    _.chain(req.body)
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
      // Map over each event
      .each(({ surveyId, email, choice }) => {
        // Find and update matching mongo document/subdocument
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              // Find a subdocument that matches this query
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            // Increment choice by 1
            $inc: { [choice]: 1 },
            // $ - find the matching recipient in the
            // query above and set responded to true
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
        ).exec(); // Execute the query
      })
      .value();

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
