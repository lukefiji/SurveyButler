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
      callbackURL: '/auth/google/callback' // Send them back to this route
    },
    accessToken => {
      console.log(accessToken);
    }
  )
);

app.get(
  '/auth/google',
  // Use 'Google' strategy
  passport.authenticate('google', {
    // Specifies to Google what scopes to give access to
    scope: ['profile', 'email']
  })
);

// Dynamic port binding
const PORT = process.env.PORT || 5000;
app.listen(PORT);
