const authController = require("../controllers/authController");
const express = require("express");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

const { signIn, signUp, updateUser, logout } = authController;

router.post("/signup", signUp);

// router.route("/signup").post(signUp);

router.post("/signin", signIn);

router.post("/logout/:id", auth, logout);

// router.put("/:id", auth, updateUser);

module.exports = router;
