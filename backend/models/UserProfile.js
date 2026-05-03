const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    height: {
      type: Number, // in cm
      required: true,
    },
    weight: {
      type: Number, // in kg
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
