const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Please enter a title"],
    minlength: [03, "Minimum length of product name is 3 characters"],
    maxlength: 20,
  },
  category: {
    type: String,
    required: [true, "Please enter a category"],
    minlength: [04, "Minimum length of category is 4 characters"],
    maxlength: 30,
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please create an account"],
  },
  // purchaseCount: {
  //   type: String,
  //   required: [true, "Please enter purchase count"],
  // },
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


// Product.aggregate([
//   {
//     $match: { productName: "string"},
//     $group: {
//       _id: "$productName",
//       count: { $sum: 1}
//     }
//   }
// ])

//productCounter.length;

const Product = mongoose.model("product", productSchema);

module.exports = Product


// const filter = { vendor:}
// let productCounter = await products.aggregate().
// match({ "title": "string"} },
//     { $group: { "_id": "vendor", "No_of_Times": { $sum: 1 } } }
//   ]
// );



// const ObjectID = mongoose.Schema.Types.ObjectId
// const itemSchema = new mongoose.Schema({
//     owner : {
//         type: ObjectID,
//         required: true,
//         ref: 'User'

//   topSellers: {
//     type: String,
//     required: [true, "Enter an amount"],
//   },

//   available product number: {
//     counter

