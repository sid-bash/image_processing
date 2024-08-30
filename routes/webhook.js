const express = require("express");
const { getDB } = require("../services/database");

const router = express.Router();

router.post("/webhook", async (req, res) => {
  const { request_id, products } = req.body;
  const db = getDB();

  await db
    .collection("products")
    .updateMany(
      { request_id },
      {
        $set: {
          status: "Completed",
          output_image_urls: products.map((p) => p.output_image_url),
          updated_at: new Date(),
        },
      }
    );

  await db
    .collection("image_processing_requests")
    .updateOne(
      { request_id },
      { $set: { status: "Completed", updated_at: new Date() } }
    );

  res.sendStatus(200);
});

module.exports = router;
