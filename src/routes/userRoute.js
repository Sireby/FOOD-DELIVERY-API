const express = require("express");
const UserController = require("../controllers/userController");
const app = express();

app.use(express.json());
const router = express.Router();

const { updateUser, getUser, getAllUsers, deleteUser } = UserController;
router.route("/user").put(updateUser).get(getAllUsers).delete(deleteUser);

router.route("/user/:id").get(getUser);

module.exports = router;
