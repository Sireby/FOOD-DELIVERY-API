const Cart = require("../models/cartModel");
// const Order = require("../models/order");
const User = require("../models/userModel");
const Product = require("../models/productModel");

const checkQuantity = (products) => {
  let quantity = 0;
  for (let index = 0; index < products.length; index++) {
    const product = products[index];
    quantity += product.quantity;
  }
  return quantity;
};
const getSubtotal = (products) => {
  let subtotal = 0;
  for (let index = 0; index < products.length; index++) {
    const product = products[index];
    subtotal += product.subtotal;
  }
};

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
        (item) => item.product._id === req.body.productId // transverse the array to find if product to be added in the array already exist in the cart
      );
      // ADD TO CART SECTION
      // CHECK IF PRODUCT ALREADY IN CART
      if (product) {
        console.log("product already exists in cart");

        let quantity = parseInt(req.body.quantity);
        // convert product quantity to a number

        product.quantity += quantity || 1;
        // it's add specified quantity of product or adds 1 if quantity not specified
        product.subtotal = product.quantity * product.price;
        cart.itemCount = checkQuantity(cart.products);
        cart.totalPrice = getSubtotal(cart.products);
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
          product: req.body.productId,
          quantity: req.body.quantity || 1,
          subtotal: productExist.price * (req.body.quantity || 1),
        });
        cart.itemCount = checkQuantity(cart.products);
        cart.quantity = getSubtotal(cart.products);
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
            quantity: req.body.quantity || 1,
            price: productExist.price,
            subtotal: productExist.price * (req.body.quantity || 1),
          },
        ],
        itemCount: req.body.quantity || 1,
        totalPrice: productExist.price * (req.body.quantity || 1),
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
    }); //check if product to be removed from the cart exists in the store

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
        (item) => item.product._id === req.body.productId // transverse the array to find if product to be added in the array already exist in the cart
      );
      // REMOVE TO CART SECTION
      // CHECK IF PRODUCT ALREADY IN CART
      if (product) {
        console.log("product already exists in cart");

        let quantity = parseInt(req.body.quantity); // convert product quantity to a number
        if (cart.products.length == 1 && product.quantity == 1) {
          await Cart.findOneAndDelete({ userId: user._id });
        }
        if (product.quantity == 1) {
          cart.products.splice(cart.products.indexOf(req.body.productId), 1);
        } else {
          product.quantity -= quantity || 1; // it's subtracts specified quantity of product or subtracts 1 if quantity not specified
          product.subtotal = product.quantity * product.price;
          cart.itemCount = checkQuantity(cart.products);
          cart.totalPrice = getSubtotal(cart.products);
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
              message: "product deleted from cart successfully",
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
      return res
        .status(409)
        .json({ success: false, message: "this user has no cart" });
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
    await Cart.findOneAndDelete({ userId: req.params }).then((cart, err) => {
      if (err) {
        res.status(400).json({
          success: false,
          message: "error occurred while deleting this user's cart",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "cart deleted successfully",
          cart: cart,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCart, removeFromCart, addToCart, deleteCart };
