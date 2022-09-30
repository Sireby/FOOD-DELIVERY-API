const { productCount } = require("../models/productModel");

function productCounter() {
  createdProduct = () => {
    let countCr = requestBody.productCount;
    try {
      if (typeof countCr === Number) {
        // if (findProduct.productCount)
        return (countCr += 1); // return +productCount += 1
      }
    } catch (error) {
      return error;
    }
  };
  deletedProduct = () => {
    let countDl = findProduct.productCount;
    try {
      if (typeof countDl === Number) {
        // if(findProduct.productCount)
        return (countDl -= 1); // return +productCount -= 1
      }
    } catch (error) {
      return error;
    }
  };
}

module.exports = productCounter;
