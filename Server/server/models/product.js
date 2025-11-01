const mongoose = require("mongoose");

// Define the Note model Schema
const ProductsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  name_de: String,
  product_manager_id: String,
  poster: String,
  price: Number,
  currency: String,
  description: String,
  description_de: String,
  theme: String,
  thumbnail: String,
  subinfoimage1: String,
  subinfoimage2: String,
  subinfoimage3: String,
  additionalinfo1: String,
  additionalinfo2: String,
  additionalinfo3: String,
  additionalinfo4: String,
  additionalinfo5: String,
  additionalinfo1_de: String,
  additionalinfo2_de: String,
  additionalinfo3_de: String,
  additionalinfo4_de: String,
  additionalinfo5_de: String,
  isfeatured: Boolean,
  category: {
    type: String,
    enum: ['ecig', 'snack', 'drink'],
    required: true,
  },
  created_at: String,
  updated_at: String,
});

module.exports = mongoose.model("Products", ProductsSchema);
