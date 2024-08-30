const express = require("express");
require('./services/database');

const app = express();
const path = require('path');
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Load routes
const uploadRoutes = require("./routes/upload");
const statusRoutes = require("./routes/status");
const webhookRoutes = require("./routes/webhook");

app.use('/outputs', express.static(path.join(__dirname, 'outputs')));
app.use('/compressed_images', express.static(path.join(__dirname, 'compressed_images')));

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use("/api/upload", uploadRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/webhook", webhookRoutes);


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
