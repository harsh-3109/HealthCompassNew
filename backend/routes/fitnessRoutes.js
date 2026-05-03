const express = require("express");
const router = express.Router();
const FitnessRecord = require("../models/FitnessRecord");

// ✅ DAILY DATA SAVE
router.post("/add", async (req, res) => {
  try {
    const { userId, steps, calories, score } = req.body;

    await FitnessRecord.create({
      userId,
      steps,
      calories,
      score
    });

    res.json({ message: "Daily fitness data saved" });
  } catch (err) {
    res.status(500).json({ message: "Save failed" });
  }
});

// ✅ WEEKLY REAL DATA
router.get("/weekly/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const last7Days = await FitnessRecord.find({ userId })
      .sort({ date: -1 })
      .limit(7);

    // order correct karne ke liye
    const ordered = last7Days.reverse();

    res.json(
      ordered.map((d) => ({
        date: d.date,
        steps: d.steps,
        calories: d.calories
      }))
    );
  } catch (err) {
    res.status(500).json({ message: "Weekly data error" });
  }
});

module.exports = router;