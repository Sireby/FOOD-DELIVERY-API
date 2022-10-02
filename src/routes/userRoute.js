const express = require("express");
const UserController = require("../controllers/userController");
const { auth, checkUser } = require("../middleware/authMiddleware");
const app = express();

app.use(express.json());
const router = express.Router();

const { updateUser, getUser, getAllUsers, deleteUser } = UserController;
router
  .route("/user")
  .put(updateUser)
  .get(auth, getAllUsers)
  .delete(auth, checkUser, deleteUser);

router.get("/user/:id", auth, getUser);

module.exports = router;
