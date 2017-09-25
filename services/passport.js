const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

// Configuring Passport strategies
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
      // Check if user already exists - database queries return promises
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // We already have a record with the given profile ID
        // done(err, doneValue)
        return done(null, existingUser);
      }

      /** 
      * If a record doesn't exist, create new record/model instance of user.
      * save() saves it to the database
      */
      const user = await new User({ googleId: profile.id }).save();
      // Receive back saved instance from db
      done(null, user);
    }
  )
);

// TODO: Set up Facebook strategy
