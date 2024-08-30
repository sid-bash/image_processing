const sharp = require("sharp");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function compressImage(inputUrl) {
  const response = await axios({ url: inputUrl, responseType: "stream" });
  const outputPath = path.join("compressed_images", path.basename(inputUrl));

  await new Promise((resolve, reject) => {
    response.data
      .pipe(sharp().jpeg({ quality: 50 }))
      .pipe(fs.createWriteStream(outputPath))
      .on("finish", resolve)
      .on("error", reject);
  });

  return outputPath;
}

module.exports = { compressImage };
