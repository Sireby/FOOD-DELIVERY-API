const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { createToken } = require("../middleware/authMiddleware");
// const handleError = require("../errorHandlers/errors");
const handleError = require("../helpers/userErrorHandler");

//Create account for user
exports.signUp = async (req, res) => {
  try {
    const { fullname, password, confirmPassword, email, role } = req.body;
    if (password !== confirmPassword) {
      res.status(400).json({ message: "Wrong Password Confirmation input" });
    }
    const salt = await bcrypt.genSalt(10);

    if (password === confirmPassword && password.length > 5) {
      const hash = await bcrypt.hash(password, salt);
      const user = await User.create({
        fullname,
        password: hash,
        confirmPassword: hash,
        email,
        role,
      });

      const token = createToken(user._id);
      return res.status(201).json({
        status: "success",
        token,
        data: {
          user,
        },
      });
    }
    res.status(400).json({ message: "Password is less than 6 characters" });
  } catch (error) {
    const errors = handleError.handleErrors(error);
    res.status(404).json({ errors });
  }
};

//Log user in
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = await createToken(user._id);
        res.status(200).json({
          status: "success",
          token,
          data: {
            user,
          },
        });
      } else {
        res.status(401).json({
          status: "fail",
          message: "Invalid email or password",
        });
      }
    }
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({
      status: "fail",
      message: errors,
    });
  }
};

//Logout
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "You've successfully logged out" });
  } catch (error) {
    res.status(404).json({ message: "Account not logged out" });
  }
};
