const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Function to download image from URL and save locally
const downloadImage = async (url, outputPath) => {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

// Function to compress image using sharp
const compressImage = async (inputPath, outputPath) => {
  await sharp(inputPath)
    .resize({ width: 800 }) // Adjust size as needed
    .jpeg({ quality: 50 })
    .toFile(outputPath);
};

// Main function to process image
const processImage = async (url, fileName, outputDir) => {
  const inputFileName = path.basename(url);
  const inputPath = path.join(outputDir, `input_${inputFileName}`);
  const outputFileName = `processed_${fileName}`;
  const outputPath = path.join(outputDir, outputFileName);
  console.log("⚙️  | outputFileName :", outputFileName);

  // Download image
  await downloadImage(url, inputPath);

  // Compress image
  await compressImage(inputPath, outputPath);

  // Clean up
  fs.unlinkSync(inputPath);

  return `http://localhost:3001/compressed_images/${outputFileName}`;
};

module.exports = {
  processImage,
};
