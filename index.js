// CommonJS modules on the server side - require()
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./models/User');
require('./services/passport'); // Execute Passport config

// Make a connection to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

const app = express();

// Configure cookie-session
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [process.env.COOKIE_KEY] // Multiple keys for additional security
  })
);

// Use passport and enable sessions
app.use(passport.initialize());
app.use(passport.session());

// Apply auth routes to app by passing it in
require('./routes/authRoutes')(app);

// Dynamic port binding
const PORT = process.env.PORT || 5000;
app.listen(PORT);
