const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

// User is model class
const User = mongoose.model('users');

// Serialize user for setting cookie
// User is instance returned from DB
passport.serializeUser((user, done) => {
  // Serialze User instance's ._id to allow usage of other auth methods
  // Automatically encrypts user data, return serialized cookie
  done(null, user.id);
});

// Convert id from cookie into a Mongo instance
passport.deserializeUser((id, done) => {
  // Find by Mongo _id
  User.findById(id).then(user => {
    // Return deserialized user object
    done(null, user);
  });
});

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
            // done(err, doneValue)
            done(null, existingUser);
          } else {
            /** 
            * If a record doesn't exist, create
            * new record/model instance of user.
            * save() saves it to the database
            */
            new User({ googleId: profile.id })
              .save()
              // Receive back saved instance from db
              .then(user => done(null, user));
          }
        });

      console.log(profile.id);
    }
  )
);

// TODO: Set up Facebook strategy