const express = require("express");
//const { auth, checkUser } = require("../middleware/authMiddleware");
const router = express.Router();
const orderController = require("../controllers/orderController");

const app = express();

app.use(express.json());

    const { createOrder , updateOrder, getUserOrder, deleteOrder, getAllOrders } = orderController;
    router.route("/create/:userId").post( createOrder);
    router.route("/order/update/:userId").patch( updateOrder);
    router.route("/order/:userId").get( getUserOrder).delete( deleteOrder);
    router.route("/allOrders").get( getAllOrders)
    

module.exports = router;