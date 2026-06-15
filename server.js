const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Url = require("./models/Url");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

app.post("/api/shorten", async (req, res) => {
  try {
    const longUrl = req.body.longUrl;

    if (!longUrl) {
      return res.status(400).json({
        message: "Long URL is required"
      });
    }

    const shortCode = generateShortCode();

    const newUrl = await Url.create({
      longUrl: longUrl,
      shortCode: shortCode
    });

    const shortUrl = `http://localhost:${PORT}/${newUrl.shortCode}`;

    res.json({
      shortUrl: shortUrl
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});

app.get("/:code", async (req, res) => {
  try {
    const code = req.params.code;

    const url = await Url.findOne({
      shortCode: code
    });

    if (!url) {
      return res.status(404).send("Short URL not found");
    }

    res.redirect(url.longUrl);

  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});