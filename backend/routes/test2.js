const fs = require('fs');
const path = require('path');

const csvPath = path.join(
  __dirname,
  "../../ai-services/data/disease_prediction/training.csv"
);

const csvData = fs.readFileSync(csvPath, "utf-8");
const headers = csvData.split("\n")[0].split(",");

const symptoms = headers
  .map(col => col.trim())
  .filter(col => col && col !== "prognosis" && col !== "Unnamed: 133");

console.log(symptoms.filter(s => s.toLowerCase().includes("fever")));
