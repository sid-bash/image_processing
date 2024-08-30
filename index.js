const express = require("express");
const { connectDB } = require('./services/database');

connectDB().catch(console.error);

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Load routes
const uploadRoutes = require("./routes/upload");
const statusRoutes = require("./routes/status");
const webhookRoutes = require("./routes/webhook");

app.use("/api", uploadRoutes);
app.use("/api", statusRoutes);
app.use("/api", webhookRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
