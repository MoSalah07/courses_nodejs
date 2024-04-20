const mongoose = require("mongoose");
const validator = require("validator");
const { ADMIN, MANGER, USER } = require("../lib/userRoles");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "filed must be a valid email address"],
  },
  password: { type: String, required: true },
  token: { type: String },
  role: { type: String, enum: [ADMIN, MANGER, USER], default: USER },
  avatar: { type: String, default: "uploads/profile.jpg" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
