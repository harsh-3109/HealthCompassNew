const mongoose = require("mongoose");

const symptomHistorySchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    preference: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    risk: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
    },
    advice: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SymptomHistory", symptomHistorySchema);
