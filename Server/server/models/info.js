const mongoose = require("mongoose");

// Define the Note model Schema
const InfosSchema = new mongoose.Schema({
  id: String,
  info_manager_id: String,
  poster: String,
  name: String,
  unit: String,
  value: String,
  thumbnail: String,
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("Infos", InfosSchema);
