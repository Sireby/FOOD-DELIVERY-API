const Product = require("../models/productModel");
// const Auth = require('./auth')
// const user = require('./user-model')
const productErrorHandler = require("../helpers/productErrorHandler");

// const productCount = require("./productCounter")

exports.createProduct = async (request, response) => {
  const requestBody = request.body;
  //   if(requestBody.uniqueProductId === Product.uniqueProductId){
  //     Product.productCount += 1
  //   }

  let findProduct = await Product.findOne({
    uniqueProductId: requestBody.uniqueProductId,
  });
  try {
    if (findProduct) {
      findProduct.productCount += 1; // findProduct = new productCount.createdProduct()
      await findProduct.save();
      return response.status(200).send({
        status: false, // check
        message: "increase product count",
      });
    } else {
      const product = new Product(requestBody);
      await product.save();
      return response.status(201).send({
        status: true,
        message: "product has been uploaded successfully",
        newProduct: product,
      });
    }
  } catch (error) {
    const err = productErrorHandler(error);
    return response.status(404).json({ err });
  }
};

exports.updateProduct = async (request, response) => {
  try {
    const findProduct = await Product.findOne(request.body.uniqueProductId);
    if (findProduct) {
      findProduct.price = request.body.price;
      findProduct.description = request.body.description;
      //findProduct.topSeller = request.body.topSeller;
      findProduct.images = request.body.images;
      await findProduct.save();
      return response.status(200).send({
        status: true,
        message: "Product has been updated successfully",
        updatedProduct: findProduct,
      });
    } else {
      return response.status(404).send({
        status: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    const err = productErrorHandler(error);
    return response.status(400).json({ err });
  }
};

exports.getProduct = async (request, response) => {
  if (request.query.user == "true") {
    try {
      const id = request.params.id;
      const findOneProduct = await Product.findById(id);
      if (!findOneProduct) {
        return response.status(404).send({
          status: false,
          message: "Product not found",
        });
      } else {
        return response.status(200).send({
          status: true,
          message: "Product found",
          User: findOneProduct,
        });
      }
    } catch (err) {
      if (err.path === "_id") {
        return response.status(401).send({
          status: false,
          message: "Invalid ID",
        });
      } else {
        return response.status(500).send({
          status: false,
          message: "Server Error",
        });
      }
    }
  } else {
    response.status(401).send({ status: false, message: "create an account" });
  }
};

exports.getProductListing = async (request, response) => {
  if (request.query.user == "true") {
    try {
      const findAllProduct = await Product.find();
      return response.status(200).send({
        status: true,
        message: "Product Listing",
        productListing: findAllProduct,
      });
    } catch (error) {
      const err = productErrorHandler(error);
      return response.status(400).json({ err });
    }
  } else {
    response.status(401).send({ status: false, message: "create an account" });
  }
};

exports.deleteProduct = async (request, response) => {
  try {
    const { id } = request.query;
    const findProduct = await Product.findByIdAndDelete(id);
    if (findProduct) {
      findProduct.productCount -= 1; // findProduct = new productCount.deletedProduct()
      return response.status(200).send({
        status: true,
        message: "Product deleted successfully",
        deletedProduct: findProduct,
      });
    } else {
      return response.status(404).send({
        status: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    const err = productErrorHandler(error);
    return response.status(400).json({ err });
  }
};
