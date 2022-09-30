const express = require("express");
const cartController = require("../controllers/cartController");
const app = express();

app.use(express.json());
const router = express.Router();

const { getCart, addToCart, removeFromCart, deleteCart } = cartController;
router.route("/cart/add/:userId").patch(addToCart);
router.route("/cart/remove/:userId").patch(removeFromCart);
router.route("/cart/:userId").get(getCart).delete(deleteCart);

module.exports = router;
