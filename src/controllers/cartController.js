const Cart = require("../models/cartModel");
// const Order = require("../models/order");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await User.findById(userID); // identify the user

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized user" });
    }

    const productExist = await Product.findOne({
      productId: req.body.productId,
    }); //check if product to be added to the cart exists in the store

    if (!productExist) {
      return res
        .status(404)
        .json({ success: false, message: "product not found in store" }); //if product doesn't exist return the json response above
    }

    const cart = await Cart.findOne({ userId: user._id }); // find the user's cart

    if (cart) {
      console.log("user has a cart");
      // check if product already exists in cart
      let product = cart.products.find(
        (item) => item.productId === req.body.productId // transverse the array to find if product to be added in the array already exist in the cart
      );
      // ADD TO CART SECTION
      // CHECK IF PRODUCT ALREADY IN CART
      if (product) {
        console.log("product already exists in cart");

        let quantity = parseInt(req.body.quantity); // convert product quantity to a number

        product.quantity += quantity || 1; // it's add specified quantity of product or adds 1 if quantity not specified
        product.subtotal = product.quantity * product.price;

        cart.save(cart, (err, cart) => {
          if (err) {
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              message: "Cart updated",
              cart: cart,
            });
          }
        });
      } else {
        // user has cart but doesnt have product in his cart
        console.log(" user has cart but doesnt have product in his cart");

        cart.products.push({
          productId: req.body.productId,
          quantity: req.body.quantity,
          name: req.body.name,
          price: req.body.price,
          subtotal: req.body.price * req.body.quantity,
        });
        cart.save((err, cart) => {
          if (err) {
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              message: "Cart updated",
              cart: cart,
            });
          }
        });
      }
    }

    // if user has no cart, create one
    else {
      console.log("user has no cart, create one");
      const cart = new Cart({
        _id: req.params.id,
        products: [
          {
            productId: req.body.productId,
            quantity: req.body.quantity,
            name: req.body.name,
            price: req.body.price,
            subtotal: req.body.price * req.body.quantity,
          },
        ],
        active: true,
      });
      cart.save((err, cart) => {
        if (err) {
          return res.json({
            success: false,
            message: err,
          });
        } else {
          return res.json({
            success: true,
            message: "Cart created",
            cart: cart,
          });
        }
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await User.findById(userID); // identify the user

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized user" });
    }

    const productExist = await Product.findOne({
      productId: req.body.productId,
    }); //check if product to be added to the cart exists in the store

    if (!productExist) {
      return res
        .status(404)
        .json({ success: false, message: "product not found in store" }); //if product doesn't exist return the json response above
    }

    const cart = await Cart.findOne({ userId: user._id }); // find the user's cart

    if (cart) {
      console.log("user has a cart");

      // check if product already exists in cart
      let product = cart.products.find(
        (item) => item.productId === req.body.productId // transverse the array to find if product to be added in the array already exist in the cart
      );
      // REMOVE TO CART SECTION
      // CHECK IF PRODUCT ALREADY IN CART
      if (product) {
        console.log("product already exists in cart");

        let quantity = parseInt(req.body.quantity); // convert product quantity to a number
        if (cart.products.length == 1 && product.quantity == 1) {
          await Cart.findOneAndDelete({ userId: user._id });
          return res.status(200).json({
            success: true,
            message: "product deleted from cart successfully",
          });
        }
        if (product.quantity == 1) {
          cart.products.splice(cart.products.indexOf(req.body.productId), 1);
        } else {
          product.quantity -= quantity || 1; // it's subtracts specified quantity of product or subtracts 1 if quantity not specified
          product.subtotal = product.quantity * product.price;
        }
        cart.save(cart, (err, cart) => {
          if (err) {
            return res.json({
              success: false,
              message: err,
            });
          } else {
            return res.json({
              success: true,
              message: "Cart updated",
              cart: cart,
            });
          }
        });
      } else {
        res
          .status(409)
          .json({ success: false, message: "cannot delete from empty cart  " });
      }
    }

    // if user has no cart, create one
    else {
      res
        .status(409)
        .json({ success: false, message: "cannot delete from empty cart  " });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    // check if cart exists
    let cart = await Cart.findOne({
      userId: req.params.id,
    });
    if (cart) {
      res.json({
        success: true,
        message: "Cart retrieved",
        cart: cart,
      });
    } else {
      res.json({
        success: false,
        message: "Cart does not exist",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteCart = async (req, res) => {
  try {
    // check if cart exists
    await Cart.findOneAndDelete;
    ({ userId: req.params });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCart, removeFromCart, addToCart, deleteCart };
