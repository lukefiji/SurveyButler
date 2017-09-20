// CommonJS modules on the server side - require()
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

const app = express();

// Use passport strategies
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Send them back to this route
      callbackURL: '/auth/google/callback'
    },
    // User has come back to our server and exchanged code for profile & email
    (accessToken, refreshToken, profile, done) => {
      console.log('accecss token', accessToken);
      console.log('refresh token', refreshToken);
      console.log('profile:', profile);
    }
  )
);

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

// Dynamic port binding
const PORT = process.env.PORT || 5000;
app.listen(PORT);
