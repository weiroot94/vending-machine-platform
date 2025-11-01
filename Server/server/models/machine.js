const mongoose = require("mongoose");

// Define the Note model Schema
const MachinesSchema = new mongoose.Schema({
  serial_number: {
    type: String,
    required: true,
    unique: true,
  },
  agent_id: {
    type: String,
    required: false,
  },
  agent: {
    type: String,
    required: false,
  },
  location: {
    type: Object,
    required: true,
  },  
  thumbnail_path: {
    type: String,
    required: false,
  },
  machine_details: {
    type: Array,
    required: true,
  },
  ads_detail: {
    type: String,
    required: true,
  },
  product_list: {
    type: Array,
    required: true,
  },
  cash_list: {
    type: Array,
    required: true,
  },
  is_online: {
    type: Boolean,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
    required: true,
  },
  latest_ping_at: {
    type: Date,
    default: null,
    required: false,
  },
  // consider to check whenever list API request is arrived
  is_online: {
    type: Boolean,
    required: true,
  },
  license_code: {
    type: String,
    requried: false,
  }
});

module.exports = mongoose.model("Machines", MachinesSchema);
