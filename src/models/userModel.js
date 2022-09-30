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
    match: [
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
      "Minimum password length is 6 characters and maximum is 16 characters and should contain Upper and lowercase and Special characters ",
    ],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method login user
userSchema.statics.login = async function (email, password) {
  const findUser = await this.findOne({ email });
  if (findUser) {
    const auth = await bcrypt.compare(password, findUser.password);
    if (auth) {
      return findUser;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

module.exports = mongoose.model("user", userSchema);
