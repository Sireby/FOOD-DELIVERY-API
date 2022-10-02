const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

const app = express();

app.use(express.json());

    const { createOrder , updateOrder, getUserOrder, deleteOrder, getAllOrders } = orderController;
    router.route("/order/create/:userId").post(createOrder);
    router.route("/order/update/:userId").patch(updateOrder);
    router.route("/order/:userId").get(getUserOrder).delete(deleteOrder);
    router.route("/order/allOrders").get(getAllOrders) 
    

module.exports = router;