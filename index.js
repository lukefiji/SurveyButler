// CommonJS modules on the server side - require()
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

require('./models/User');
require('./models/Survey');
require('./services/passport'); // Execute Passport config

// Make a connection to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

const app = express();

// Use body-parser to parse HTTP body as req.body into JSON
app.use(bodyParser.json());

// Configure cookie-session middleware
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    keys: [process.env.COOKIE_KEY] // Multiple keys for additional security
  })
);

// Tell passport to use cookies to manage authentication
app.use(passport.initialize());
app.use(passport.session());

// Apply auth routes to app by passing it in
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

// If deployment evironment is production
if (process.env.NODE_ENV === 'production') {
  // First, check for production assets like main.js or main.css
  app.use(express.static('client/build'));

  // Second, send index.html if route isn't recognized - pass route to React
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Dynamic port binding
const PORT = process.env.PORT;
app.listen(PORT);
