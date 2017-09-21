require('dotenv').config();
// CommonJS modules on the server side - require()
const express = require('express');
const mongoose = require('mongoose');
require('./services/passport'); // Execute Passport config
require('./models/User');

// Make a connection to MongoDB
mongoose.connect(process.env.MONGODB_URI);

const app = express();
// Apply auth routes to app by passing it in
require('./routes/authRoutes')(app);

// Dynamic port binding
const PORT = process.env.PORT || 5000;
app.listen(PORT);
