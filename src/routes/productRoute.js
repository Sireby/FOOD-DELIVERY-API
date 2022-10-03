const express = require("express");
const productController = require("../controllers/productController");
const { auth, checkUser } = require("../middleware/authMiddleware");

const productRouter = express.Router();

const { createProduct, updateProduct, getProduct, getProductListing, deleteProduct } =
  productController;

productRouter
  .route("/product")
  .post(auth, checkUser("vendor"), createProduct)
  // .put(auth, checkUser("vendor"), updateProduct)
  .get(auth, getProductListing)
  .delete(auth, checkUser("vendor", "admin"), deleteProduct);

productRouter.put("/product/:id", auth, checkUser("vendor"), updateProduct);
productRouter.get("/product/:id", auth, getProduct);

module.exports = productRouter;
