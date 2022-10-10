const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please enter a title"],
    minlength: [3, "Minimum length of product name is 3 characters"],
    maxlength: 20,
  },
  category: {
    type: String,
    required: [true, "Please enter a category"],
    minlength: [4, "Minimum length of category is 4 characters"],
    maxlength: 30,
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please create an account"],
  },
 
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product"
  },
  productCounter: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: [true, "Enter a price"],
  },
  description: {
    type: String,
    required: [true, "Enter a description"],
    minlength: [13, "Minimum length of description is 50 characters"],
    maxlength: 300,
  },
  images: {
    type: String,
    required: [true, "Enter image URL"],
  },
}, { timestamps: true }
);



const Product = mongoose.model("product", productSchema);

module.exports = Product
