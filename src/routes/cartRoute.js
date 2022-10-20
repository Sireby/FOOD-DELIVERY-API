const express = require("express");
const cartController = require("../controllers/cartController");
const { auth, checkUser } = require("../middleware/authMiddleware");
const app = express();

app.use(express.json());
const router = express.Router();

const { getCart, addToCart, removeFromCart, deleteCart } = cartController;
router.route("/cart/add/:id").patch( addToCart);
router.route("/cart/remove/:id").patch( removeFromCart);
router.route("/cart/:id").get( getCart);
router.route("/cart/:id").delete( deleteCart);

module.exports = router;
