const mongoose = require("mongoose");

// Define the Note model Schema
const LanguagesSchema = new mongoose.Schema({
    id: String,
    name: String,
    thumbnail: String,
    role: String,
    created_at: String,
    updated_at: String,
});

module.exports = mongoose.model("Languages", LanguagesSchema);
