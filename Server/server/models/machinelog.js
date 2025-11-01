const mongoose = require("mongoose");

// Define the Note model Schema
const UpdatedLogsSchema = new mongoose.Schema({
  id: String,
  serial_number: String,
  updated_item: String,
  date: Date
});

module.exports = mongoose.model("UpdatedLogs", UpdatedLogsSchema);
