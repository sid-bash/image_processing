const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017"; // MongoDB connection string
const client = new MongoClient(uri, { useUnifiedTopology: true });

let db;

async function connectDB() {
  await client.connect();
  db = client.db("image_processing");
  console.log("Connected to MongoDB");
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
