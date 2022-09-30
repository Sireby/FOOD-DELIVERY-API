const express = require("express");
const productController = require("../controller/productController");

const productRouter = express.Router();

const { createProduct, updateProduct, getProductListing, deleteProduct } =
  productController;

productRouter
  .route("/product")
  .post(createProduct)
  .put(updateProduct)
  .get(getProductListing)
  .delete(deleteProduct);

const { getProduct } = productController;
router.route("/product/:id").get(getProduct);

module.exports = productRouter;
