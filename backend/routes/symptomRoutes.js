const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const router = express.Router();

/* =======================================================
   1️⃣ AI PREDICTION ROUTE (SUPER FIXED 🔥)
======================================================= */

router.post("/ai/symptom-check", async (req, res) => {
  try {
    const { symptoms, text, image } = req.body;

    console.log("📥 Incoming Request:", req.body);

    // 🔥 VALIDATION + FLEXIBLE INPUT
    let payload = {};

    if (text && typeof text === "string") {
      payload.text = text;
    } 
    if (symptoms && Array.isArray(symptoms)) {
      payload.symptoms = symptoms;
    } 
    if (image && typeof image === "string") {
      payload.image = image;
    }

    if (!payload.text && !payload.symptoms && !payload.image) {
      return res.status(400).json({
        message: "Provide text, symptoms array, or an image scan"
      });
    }

    console.log("🚀 Sending to FastAPI:", payload);

    // 🔥 CALL FASTAPI
    const AI_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
    const response = await axios.post(
      `${AI_URL}/predict`,
      payload,
      {
        timeout: 60000, // increased timeout for initial ML load
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ FastAPI Response:", response.data);

    return res.json(response.data);

  } catch (error) {
    console.error("❌ FULL ERROR:", error.message);

    // 🔥 IF FASTAPI RETURNED ERROR
    if (error.response) {
      console.error("🔥 FastAPI Error Data:", error.response.data);

      return res.status(500).json({
        message: "AI prediction failed",
        error: error.response.data
      });
    }

    // 🔥 FASTAPI NOT RUNNING
    if (error.code === "ECONNREFUSED") {
      return res.status(500).json({
        message: "AI server is not running (FastAPI बंद है)"
      });
    }

    // 🔥 TIMEOUT
    if (error.code === "ECONNABORTED") {
      return res.status(500).json({
        message: "AI server timeout (slow response)"
      });
    }

    // 🔥 GENERIC ERROR
    return res.status(500).json({
      message: "Unexpected server error"
    });
  }
});

/* =======================================================
   2️⃣ GET SYMPTOMS LIST
======================================================= */

router.get("/symptoms-list", async (req, res) => {
  try {
    const csvPath = path.join(
      __dirname,
      "../../ai-services/data/disease_prediction/training.csv"
    );

    if (!fs.existsSync(csvPath)) {
      return res.status(500).json({
        message: "Dataset file not found"
      });
    }

    const csvData = fs.readFileSync(csvPath, "utf-8");

    const headers = csvData.split("\n")[0].split(",");

    const symptoms = headers
      .map(col => col.trim())
      .filter(col => col && col !== "prognosis" && col !== "Unnamed: 133");

    return res.json(symptoms);

  } catch (error) {
    console.error("❌ Symptoms List Error:", error.message);

    return res.status(500).json({
      message: "Failed to load symptoms list"
    });
  }
});

module.exports = router;