const mongoose = require('mongoose');
const { Schema } = mongoose;

// This is a subdocument of Survey
const recipientSchema = new Schema({
  email: String,
  responded: { type: Boolean, default: false }
});

module.exports = recipientSchema;
