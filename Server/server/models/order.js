const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  orderer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machines',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',
    required: true,
  },
  product_count: {
    type: Number,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  payment: {
    type: String,
    enum: ['qr', 'cash'],
    required: true,
  },
  purchased: {
    type: String,
    enum: ['pending', 'failed', 'success'],
    required: true
  },
  hash_value: {
    type: String,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Orders", OrdersSchema);
