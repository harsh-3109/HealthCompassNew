const express = require("express");
const router = express.Router();
const UserProfile = require("../models/UserProfile");

// SAVE or UPDATE user profile
router.post("/profile", async (req, res) => {
  try {
    const { uid, name, age, height, weight, bloodGroup } = req.body;

    const existingProfile = await UserProfile.findOne({ uid });

    if (existingProfile) {
      existingProfile.name = name;
      existingProfile.age = age;
      existingProfile.height = height;
      existingProfile.weight = weight;
      existingProfile.bloodGroup = bloodGroup;

      await existingProfile.save();
      return res.json({ message: "Profile updated successfully" });
    }

    const newProfile = new UserProfile({
      uid,
      name,
      age,
      height,
      weight,
      bloodGroup,
    });

    await newProfile.save();
    res.json({ message: "Profile saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user profile by UID
router.get("/profile/:uid", async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      uid: req.params.uid,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
