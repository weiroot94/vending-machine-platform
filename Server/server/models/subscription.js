const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sent_at: {
    type: String,
  },
  created_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Subscriptions", SubscriptionSchema);
