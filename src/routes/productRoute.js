const express = require("express");
const productController = require("../controllers/productController");

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
productRouter.route("/product/:id").get(getProduct);

module.exports = productRouter;
