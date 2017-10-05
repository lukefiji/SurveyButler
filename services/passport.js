const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');

// Use JS' built-in promises in mongoose
mongoose.Promise = global.Promise;

// User is a model class
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

// Configure Google OAtuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Send them back to this route
      callbackURL: '/auth/google/callback',
      // Trusts any proxies - because Heroku's proxy uses http://
      proxy: true
    },
    // User has come back to our server and exchanged code for profile
    async (accessToken, refreshToken, profile, done) => {
      // Extract email
      const email = profile.emails[0].value;
      console.log(email);

      // Check if user already exists - database queries return promises
      const existingUser = await User.findOne({
        email: email
      });

      if (existingUser && existingUser.googleId === profile.id) {
        // We already have a record with the given profile ID
        // done(err, doneValue)
        return done(null, existingUser);
      } else if (existingUser) {
        return done(new Error('User exists!'));
      }

      /** 
       * If a record doesn't exist, create new record/model instance of user.
       * save() saves it to the database
       */
      const user = await new User({
        authType: 'Google',
        googleId: profile.id,
        email: email
      }).save();
      // Receive back saved instance from db
      done(null, user);
    }
  )
);

// Configure Facebook OAuth strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
      profileFields: ['email'],
      proxy: true
    },
    // User has come back to our server and exchanged code for profile
    async (accessToken, refreshToken, profile, done) => {
      // Extract email
      const email = profile.emails[0].value;

      // Check if user already exists - database queries return promises
      const existingUser = await User.findOne({
        email: email
      });

      if (existingUser && existingUser.facebookId === profile.id) {
        // We already have a record with the given profile ID
        // done(err, doneValue)
        return done(null, existingUser);
      } else if (existingUser) {
        return done(null, false, {
          message: `Please log in using ${existingUser.authMethod}`
        });
      }

      /** 
      * If a record doesn't exist, create new record/model instance of user.
      * save() saves it to the database
      */
      const user = await new User({
        authType: 'Facebook',
        facebookId: profile.id,
        email: email
      }).save();
      // Receive back saved instance from db
      done(null, user);
    }
  )
);
