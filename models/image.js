// models/image.js

const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  
  serialNumber: { type: String, required: true },
  productName: { type: String, required: true },
  inputImageUrls: [String],
  outputImageUrls: [String],
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
