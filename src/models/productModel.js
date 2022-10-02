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
  uniqueProductId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Please enter Unique productId"],
    minlength: [06, "Minimum length of unique productId is 6 characters"],
    maxlength: 21,
    // match: [
    //   ([(milanProduct)[/](a-zA-Z0-9)]+), "Enter a valid unique",
    // ]
  },
  purchaseCount: {
    type: String,
    required: [true, "Please enter purchase count"],
  },
  productCount: {
    type: Number,
  },
  price: {
    type: String,
    required: [true, "Enter a price"],
  },
  description: {
    type: String,
    required: [true, "Enter a description"],
    minlength: [50, "Minimum length of description is 50 characters"],
    maxlength: 300,
  },

  images: {
    type: String,
    required: [true, "Enter image URL"],
  },
  timestamps: {
    type: String,
    required: [true, "Enter entry time and Date"],
  },
});

module.exports = mongoose.model("product", productSchema);

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
