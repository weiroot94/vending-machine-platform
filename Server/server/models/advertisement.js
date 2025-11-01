const mongoose = require("mongoose");

// Define the Note model Schema
const AdvertisementsSchema = new mongoose.Schema({
  id: String,
  ads_manager_id: String,
  poster: String,
  title: String,
  type: String,
  filepath: String,
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("Advertisements", AdvertisementsSchema);
