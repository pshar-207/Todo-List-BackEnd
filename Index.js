const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const app = express();
app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: "*", // Allow all origins (for testing)
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: process.env.DATABASE,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Save User to MongoDB
app.post("/api/users", async (req, res) => {
  try {
    const { displayName, email } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ displayName, email });
      await user.save();
    }

    res.status(200).json({ message: "User saved successfully", user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
