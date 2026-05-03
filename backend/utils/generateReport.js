const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = function generateReport(data) {
  const filePath = path.join(
    __dirname,
    "../../reports",
    `${data.patientId}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(22).text("HealthCompass AI", { align: "center" });
  doc.fontSize(14).text("Medical Assessment Report", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Patient ID: ${data.patientId}`);
  doc.text(`Date: ${new Date().toDateString()}`);
  doc.moveDown();

  doc.text(`Possible Condition: ${data.disease}`);
  doc.text(`Confidence: ${data.confidence}%`);
  doc.text(`Risk Level: ${data.risk}`);
  doc.moveDown();

  doc.text("Symptoms Matched:");
  data.symptoms.forEach(s => doc.text(`• ${s}`));
  doc.moveDown();

  doc.text("Medical Explanation:");
  doc.text(data.explanation);
  doc.moveDown();

  doc.text("Precautions:");
  data.precautions.forEach(p => doc.text(`• ${p}`));

  doc.moveDown();
  doc.fontSize(10).text(
    "⚠️ This report is AI generated and not a medical diagnosis.",
    { align: "center" }
  );

  doc.end();
  return filePath;
};
