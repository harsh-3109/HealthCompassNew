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
    // HARDCODED FOR VERCEL DEPLOYMENT: The frontend just needs the list of symptoms.
    // We cannot read the CSV because the ai-services folder doesn't exist on Vercel's Node backend.
    const headers = "itching,skin_rash,nodal_skin_eruptions,continuous_sneezing,shivering,chills,joint_pain,stomach_pain,acidity,ulcers_on_tongue,muscle_wasting,vomiting,burning_micturition,spotting_ urination,fatigue,weight_gain,anxiety,cold_hands_and_feets,mood_swings,weight_loss,restlessness,lethargy,patches_in_throat,irregular_sugar_level,cough,high_fever,sunken_eyes,breathlessness,sweating,dehydration,indigestion,headache,yellowish_skin,dark_urine,nausea,loss_of_appetite,pain_behind_the_eyes,back_pain,constipation,abdominal_pain,diarrhoea,mild_fever,yellow_urine,yellowing_of_eyes,acute_liver_failure,fluid_overload,swelling_of_stomach,swelled_lymph_nodes,malaise,blurred_and_distorted_vision,phlegm,throat_irritation,redness_of_eyes,sinus_pressure,runny_nose,congestion,chest_pain,weakness_in_limbs,fast_heart_rate,pain_during_bowel_movements,pain_in_anal_region,bloody_stool,irritation_in_anus,neck_pain,dizziness,cramps,bruising,obesity,swollen_legs,swollen_blood_vessels,puffy_face_and_eyes,enlarged_thyroid,brittle_nails,swollen_extremeties,excessive_hunger,extra_marital_contacts,drying_and_tingling_lips,slurred_speech,knee_pain,hip_joint_pain,muscle_weakness,stiff_neck,swelling_joints,movement_stiffness,spinning_movements,loss_of_balance,unsteadiness,weakness_of_one_body_side,loss_of_smell,bladder_discomfort,foul_smell_of urine,continuous_feel_of_urine,passage_of_gases,internal_itching,toxic_look_(typhos),depression,irritability,muscle_pain,altered_sensorium,red_spots_over_body,belly_pain,abnormal_menstruation,dischromic _patches,watering_from_eyes,increased_appetite,polyuria,family_history,mucoid_sputum,rusty_sputum,lack_of_concentration,visual_disturbances,receiving_blood_transfusion,receiving_unsterile_injections,coma,stomach_bleeding,distention_of_abdomen,history_of_alcohol_consumption,fluid_overload,blood_in_sputum,prominent_veins_on_calf,palpitations,painful_walking,pus_filled_pimples,blackheads,scurring,skin_peeling,silver_like_dusting,small_dents_in_nails,inflammatory_nails,blister,red_sore_around_nose,yellow_crust_ooze".split(",");

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