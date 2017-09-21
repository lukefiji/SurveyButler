const mongoose = require('mongoose');
const { Schema } = mongoose;

// Creating a Mongoose schema
const userSchema = new Schema({
  googleId: String
});

// Create a new 'users' collection using the provided schema
mongoose.model('users', userSchema);
