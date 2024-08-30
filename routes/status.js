const express = require("express");
const { getDB } = require("../services/database");

const router = express.Router();

router.get("/status/:requestId", async (req, res) => {
  const requestId = req.params.requestId;
  const db = getDB();
  const request = await db
    .collection("image_processing_requests")
    .findOne({ request_id: requestId });

  if (!request) {
    return res.status(404).json({ error: "Request ID not found" });
  }

  res.json({ status: request.status });
});

module.exports = router;
