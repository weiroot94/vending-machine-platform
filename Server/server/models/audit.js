const mongoose = require("mongoose");

// Define the Note model Schema
const AuditsSchema = new mongoose.Schema({
  user_id: String,
  role: String,
  type: String,
  color: String,
  comment: String,
  created_at: String,
});

module.exports = mongoose.model("Audits", AuditsSchema);
