const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Replace the placeholder with your MongoDB connection string
const CONNECTION_STRING = "mongodb://127.0.0.1:27017/iVersion-db";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});

const VM = require("./vmModel");

app.get("/api/getPackages", async (req, res) => {
  try {
    const packages = await VM.find(
      {},
      {
        "Package name": 1,
        "Date of collection": 1,
        "Installed version": 1,
        "Latest version": 1,
        CVEs: 1,
      }
    );
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching packages", error });
  }
});
