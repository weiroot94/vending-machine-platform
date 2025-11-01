const mongoose = require("mongoose");

// Define the Note model Schema
const DepositSchema = new mongoose.Schema({
  depositor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value > 0;
      },
      message: props => `Deposit amount must be value above zero`
    }
  },
  method: {
    type: String,
    enum: ['card', 'paypal'],
    required: true
  },
  debitcard: {
    name: String,
    cardno: String,
    cvcno: Number,
  },
  transaction_id: String,
  created_at: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Deposit", DepositSchema);
