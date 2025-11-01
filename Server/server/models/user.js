const mongoose = require("mongoose");

// Define the Note model Schema
const UsersSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: props => `Invalid format of Email`,
    }
  },
  role: {
    type: String,
    enum: ['administrator', 'agent', 'ads'],
    required: true,
  },
  googleId: String,
  password: {
    type: String,
    required: false,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: String,
  area: Array,
  subscribed: {
    type: Boolean,
    required: true,
  },
  ipaddr: {
    type: String,
    required: false,
  },
  useragent: {
    type: String,
    required: false,
  },
  created_at: {
    type: String,
    required: true,
  },
  updated_at: String,
});

module.exports = mongoose.model("Users", UsersSchema);
