const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// User is model class
const User = mongoose.model('users');

// Configuring Passport strategies
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Send them back to this route
      callbackURL: '/auth/google/callback'
    },
    // User has come back to our server and exchanged code for profile
    (accessToken, refreshToken, profile, done) => {
      // Check if user already exists
      User.findOne({ googleId: profile.id })
        // Database queries return promises
        .then(existingUser => {
          if (existingUser) {
            // We already have a record with the given profile ID
          } else {
            /** 
            * If a record doesn't exist, create
            * new record/model instance of user.
            * save() saves it to the database
            */
            new User({ googleId: profile.id }).save();
          }
        });

      console.log(profile.id);
    }
  )
);
