const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    photo: { type: String, required: true },
    theme: { type: String, default: "DefaultTheme" },
  },
  {
    collection: "users",
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
