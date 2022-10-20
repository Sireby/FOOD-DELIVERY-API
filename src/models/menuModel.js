const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
  foodName: {
    type: String,
    required: [true, "Please enter food name"],
    minlength: [3, "Minimum length of food name is 3 characters"],
    maxlength: 200,
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
 
  foodId: {
    type: mongoose.Schema.ObjectId,
    ref: "menu"
  },
  foodCounter: {
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
    maxlength: 500,
  },
  images: {
    type: String,
    required: [true, "Enter image URL"],
  },
}, { timestamps: true }
);



const Menu = mongoose.model("menu", menuSchema);

module.exports = Menu
