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

  app.get(
    '/auth/google/callback',
    // Middleware sees that URL has auth code,
    // exchanges it with user profile & email
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  app.get('/api/logout', (req, res) => {
    // logout() is attatched automatically to request by passport
    req.logout();
    res.send(req.user);
  });

  // Test authentication
  app.get('/api/current-user', (req, res) => {
    // Sends back deserialized cookie of the current user
    res.send(req.user);
  });
};
