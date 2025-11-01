const mongoose = require("mongoose");

const ChangelogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  changelog: {
    type: [
        {
            version: String,
            comment: String,
            gitbranch: String,
            gitcommit: String,
            created_at: Date,
        }
    ],
    required: true,
  },
});

module.exports = mongoose.model("Changelog", ChangelogSchema);
