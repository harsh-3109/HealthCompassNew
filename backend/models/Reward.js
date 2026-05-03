const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    metadata: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);
