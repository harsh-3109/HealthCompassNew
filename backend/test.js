const path = require('path');
const fs = require('fs');

const csvPath = path.join(
  __dirname,
  "routes",
  "../../ai-services/data/disease_prediction/training.csv"
);

console.log("Path:", csvPath);
console.log("Exists:", fs.existsSync(csvPath));
