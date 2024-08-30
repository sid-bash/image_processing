const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../services/database");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  const requestId = uuidv4();
  const filePath = req.file.path;
  const db = getDB();

  const products = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      if (
        data["Serial Number"] &&
        data["Product Name"] &&
        data["Input Image Urls"]
      ) {
        products.push({
          request_id: requestId,
          serial_number: data["Serial Number"],
          product_name: data["Product Name"],
          input_image_urls: data["Input Image Urls"]
            .split(",")
            .map((url) => url.trim()),
          output_image_urls: [],
          status: "Pending",
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    })
    .on("end", async () => {
      await db.collection("image_processing_requests").insertOne({
        request_id: requestId,
        file_name: req.file.originalname,
        status: "Pending",
        created_at: new Date(),
        updated_at: new Date(),
      });

      await db.collection("products").insertMany(products);

      // Start asynchronous image processing (to be implemented)
      res.json({ request_id: requestId });
    });
});

module.exports = router;
