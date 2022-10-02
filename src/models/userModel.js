const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please enter your fullname"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password "],
    minlength: [6, "Password is less than 6 characters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [
      true,
      "Wrong! make sure input is of the same characters with password",
    ],
    minlength: [6, "Password is less than 6 characters"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "vendor", "admin"],
  },
});

module.exports = mongoose.model("user", userSchema);
