const mongoose = require("mongoose");

// Define the Note model Schema
const UpdatesSchema = new mongoose.Schema({
    id: String,
    comment: String,
    git: String,
    status: Boolean,
    created_at: String,
    updated_at: String,
});

module.exports = mongoose.model("Updates", UpdatesSchema);
