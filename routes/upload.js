const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { processImage } = require("../services/imageProcessing");
const Image = require("../models/image"); // Import your Mongoose model
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fastcsv = require("fast-csv");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const requestId = new Date().getTime().toString();
  const outputFilePath = path.join("outputs", `processed_${requestId}.csv`);

  // Ensure output directory exists
  if (!fs.existsSync("outputs")) {
    fs.mkdirSync("outputs");
  }

  const records = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      // Temporarily store data in an array
      records.push(row);
    })
    .on("end", async () => {
      console.log("⚙️  | records before processing:", records);

      // Process images for each row
      const processedRecords = await Promise.all(
        records.map(async (row) => {
          const {
            "S. No.": serialNumber,
            "Product Name": productName,
            "Image Input Urls": inputImageUrls,
          } = row;
          const outputImageUrls = [];

          let i = 1;
          for (const url of inputImageUrls.split(",")) {
            const outputDir = "compressed_images/";
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir);
            }
            const fileName = `${serialNumber}_${i}`;
            const outputUrl = await processImage(url, fileName, outputDir);
            outputImageUrls.push(outputUrl);
            i++;
          }

          console.log("⚙️  | processed outputImageUrls:", outputImageUrls);

          // Save to database
          await Image.create({
            serialNumber,
            productName,
            inputImageUrls: inputImageUrls.split(","),
            outputImageUrls,
          });

          // Return record with processed URLs
          return {
            serialNumber,
            productName,
            inputImageUrls,
            outputImageUrls: outputImageUrls.join(","),
          };
        })
      );

      console.log("⚙️  | processedRecords:", processedRecords);

      const headers = [
        '"S. No."',
        '"Product Name"',
        '"Input Image Urls"',
        '"Output Image Urls"',
      ];
      const csvRows = [];
      csvRows.push(headers.join(",")); // Add headers

      processedRecords.forEach((record) => {
        const row = [
          record.serialNumber,
          record.productName,
          record.inputImageUrls,
          record.outputImageUrls,
        ];
        csvRows.push(row.join(","));
      });

      const csvData = csvRows.join("\n");

      // Write the CSV data to a file
      fs.writeFileSync(outputFilePath, csvData);

      fs.unlinkSync(filePath); // Clean up original CSV file

      res.status(200).json({
        requestId,
        downloadLink: `http://localhost:3001/outputs/processed_${requestId}.csv`,
      });
    });
});

module.exports = router;
