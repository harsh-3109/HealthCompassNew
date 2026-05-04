const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Routes
const profileRoutes = require("./routes/profileRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const fitnessRoutes = require("./routes/fitnessRoutes");
const rewardRoutes = require("./routes/rewardRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

// 🔥 CORS FIX (IMPORTANT)
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json({ limit: "50mb" }));

/* -------------------- ROUTES -------------------- */

// 👉 IMPORTANT: check ye route sahi ho
app.use("/api", profileRoutes);
app.use("/api", symptomRoutes);
app.use("/api", fitnessRoutes);
app.use("/api", rewardRoutes);
app.use("/api", chatbotRoutes);

/* -------------------- TEST ROUTE -------------------- */
app.get("/", (req, res) => {
  res.send("HealthCompass Backend is Running 🚀");
});

/* -------------------- DATABASE -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 5000;

// Export app for Vercel serverless, or listen locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;