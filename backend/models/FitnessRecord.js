const mongoose = require("mongoose");

const FitnessRecordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  steps: {
    type: Number,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("FitnessRecord", FitnessRecordSchema);