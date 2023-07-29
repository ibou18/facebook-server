const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// play function before save into display: 'block',

const DocumentModel = mongoose.model("Document", documentSchema);

module.exports = DocumentModel;
