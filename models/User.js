const mongoose = require('mongoose');
const { Schema } = mongoose;

// Creating a Mongoose schema
const userSchema = new Schema({
  authType: String,
  email: String,
  googleId: String,
  facebookId: String,
  credits: { type: Number, default: 0 }
});

// Create a new 'users' collection using the provided schema
mongoose.model('users', userSchema);
