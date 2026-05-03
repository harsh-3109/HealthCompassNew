const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { query, image } = req.body;

    if (!query && !image) {
      return res.status(400).json({ message: "Query or image is required" });
    }

    const AI_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
    const response = await axios.post(
      `${AI_URL}/chat`,
      { query: query || "What can you see in this image?", image },
      {
        timeout: 60000,
        headers: { "Content-Type": "application/json" }
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error("❌ Chat API Error:", error.message);
    if (error.response) return res.status(500).json(error.response.data);
    res.status(500).json({ message: "AI Chat server is not running or timed out." });
  }
});

module.exports = router;
