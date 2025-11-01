const mongoose = require("mongoose");

// Define the Note model Schema
const LanguageValuesSchema = new mongoose.Schema({
    id: String,
    language_key: String,
    language_value: String,
    language_type: String,
});

module.exports = mongoose.model("LanguageValues", LanguageValuesSchema);
