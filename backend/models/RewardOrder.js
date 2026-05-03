const mongoose = require("mongoose");

const RewardOrderSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    pointsDeducted: {
      type: Number,
      required: true,
    },
    shippingDetails: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
      landmark: { type: String }
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RewardOrder", RewardOrderSchema);
