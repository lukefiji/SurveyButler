const passport = require('passport');

// Exporting function from file
module.exports = app => {
  // Route to auth for google
  app.get(
    '/auth/google',
    // Use 'Google' strategy
    passport.authenticate('google', {
      // Specifies to Google what scopes to give access to
      scope: ['profile', 'email']
    })
  );

  // Sees that URL has auth code, and exchanges it with user profile & email
  app.get('/auth/google/callback', passport.authenticate('google'));
};
