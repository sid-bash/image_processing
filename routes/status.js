const express = require("express");
const Image = require("../models/image");

const router = express.Router();

router.get("/:requestId", async (req, res) => {
  const { requestId } = req.params;

  try {
    const imageData = await Image.find({ requestId });
    console.log("⚙️  | imageData :", imageData);
    if (imageData.length > 0) {
      const outputFilePath = `http://localhost:3001/outputs/processed_${requestId}.csv`;
      res
        .status(200)
        .json({
          status: "completed",
          data: imageData,
          downloadLink: outputFilePath,
        });
    } else {
      res.status(404).json({ status: "not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
