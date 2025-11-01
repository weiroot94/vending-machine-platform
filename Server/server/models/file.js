const mongoose = require("mongoose");

// Define the Note model Schema
const UploadFileSchema = new mongoose.Schema({
  filepath: String,
  time: String,
});

module.exports = mongoose.model("UploadFile", UploadFileSchema);
