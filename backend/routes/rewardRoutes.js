const express = require("express");
const router = express.Router();
const Reward = require("../models/Reward");
const RewardOrder = require("../models/RewardOrder");

// 🔹 Calculate reward points from fitness score
function calculatePoints(score) {
  if (score >= 90) return 50;
  if (score >= 70) return 30;
  if (score >= 50) return 15;
  return 5;
}

// 🔹 Add reward points
router.post("/rewards", async (req, res) => {
  const { uid, score, points: explicitPoints, reason: explicitReason, type } = req.body;

  let points = 0;
  let reason = "Activity";

  // Determine Activity Type
  if (type === "ai_consultation") {
    reason = "AI Health Consultation";
    points = 10;
  } else if (type === "symptom_check") {
    reason = "Symptom Analysis";
    points = 10;
  } else if (score !== undefined) {
    reason = "Fitness Activity";
    points = calculatePoints(score);
  } else if (explicitPoints !== undefined) {
    reason = explicitReason || "Platform Usage";
    points = explicitPoints;
  }

  // Check if reward for this activity already exists today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const existingRewardToday = await Reward.findOne({
    uid,
    reason,
    createdAt: { $gte: startOfDay }
  });

  if (existingRewardToday) {
    return res.json({ 
      message: "You have already earned rewards for this activity today. Try again tomorrow.", 
      points: 0 
    });
  }

  const reward = await Reward.create({
    uid,
    points,
    reason,
  });

  res.json({
    message: "Reward points added",
    points,
  });
});

// 🔹 Redeem Reward
router.post("/rewards/redeem", async (req, res) => {
  try {
    const { uid, itemName, itemPoints, shippingDetails } = req.body;

    // 1. Verify User Points
    const rewards = await Reward.find({ uid });
    const totalPoints = rewards.reduce((sum, r) => sum + r.points, 0);

    if (totalPoints < itemPoints) {
      return res.status(400).json({ message: "Insufficient points to redeem this item." });
    }

    // 2. Deduct Points (Negative Reward Entry)
    await Reward.create({
      uid,
      points: -itemPoints,
      reason: `Redeemed: ${itemName}`
    });

    // 3. Save Order
    const order = await RewardOrder.create({
      uid,
      itemName,
      pointsDeducted: itemPoints,
      shippingDetails
    });

    res.json({ message: "Reward redeemed successfully!", orderId: order._id });
  } catch (error) {
    console.error("Redemption error:", error);
    res.status(500).json({ message: "Server error during redemption." });
  }
});

// 🔹 Get reward history
router.get("/rewards/:uid", async (req, res) => {
  const rewards = await Reward.find({ uid: req.params.uid })
    .sort({ createdAt: -1 });

  let totalPoints = rewards.reduce((sum, r) => sum + r.points, 0);

  // Apply decay logic if inactive
  const lastActivity = rewards.find(r => r.points > 0);
  
  if (lastActivity && totalPoints > 0) {
    const hoursSinceLast = (new Date() - new Date(lastActivity.createdAt)) / (1000 * 60 * 60);
    
    if (hoursSinceLast > 48) {
      const lastDecay = rewards.find(r => r.reason === "Inactivity Penalty");
      let applyDecay = false;
      
      if (!lastDecay) {
        applyDecay = true;
      } else {
        const hoursSinceLastDecay = (new Date() - new Date(lastDecay.createdAt)) / (1000 * 60 * 60);
        if (hoursSinceLastDecay > 24) {
           applyDecay = true;
        }
      }

      if (applyDecay) {
        const decayAmount = Math.min(20, totalPoints);
        const decayReward = await Reward.create({
          uid: req.params.uid,
          points: -decayAmount,
          reason: "Inactivity Penalty",
          metadata: []
        });
        rewards.unshift(decayReward);
        totalPoints -= decayAmount;
      }
    }
  }

  res.json({ totalPoints, rewards });
});

module.exports = router;
