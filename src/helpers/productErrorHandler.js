const { request } = require("http");
const { deleteMenuItem } = require("../controllers/menuController");
const {
  foodName,
  category,
  price,
  description,
  images,
  timestamps,
} = require("../models/menuModel");

const menuErrorHandler = (err) => {
  console.log(err.message);
  let error = {
    foodName: "",
    category: "",
    uniqueFoodId: "",
    price: "",
    description: "",
    images: "",
    timestamps: "",
  };

  if (err.message.includes("Item validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  }
  return error;
};

module.exports = menuErrorHandler;
