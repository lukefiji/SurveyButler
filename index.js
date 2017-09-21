require('dotenv').config();
// CommonJS modules on the server side - require()
const express = require('express');
const mongoose = require('mongoose');
require('./models/User');
require('./services/passport'); // Execute Passport config

// Make a connection to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

const app = express();
// Apply auth routes to app by passing it in
require('./routes/authRoutes')(app);

// Dynamic port binding
const PORT = process.env.PORT || 5000;
app.listen(PORT);
