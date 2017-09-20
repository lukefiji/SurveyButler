const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configuring Passport strategies
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
