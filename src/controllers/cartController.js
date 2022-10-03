const Cart = require("../models/cartModel");
// const Order = require("../models/order");
const User = require("../models/user-model");
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
    const item = products[index];
    subtotal += item.subtotal;
    console.log(subtotal);
  }
  return subtotal;
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
      _id: req.body.productId,
    }); //check if product to be added to the cart exists in the store

    if (!productExist) {
      return res
        .status(404)
        .json({
          success: false,
          message: "product to be added to cart not found in store",
        }); //if product doesn't exist return the json response above
    }

    const cart = await Cart.findOne({ _id: user._id }); // find the user's cart

    if (cart) {
      // check if product already exists in cart
      let product = cart.products.find((item) => {
        if (item.productID === req.body.productId) {
          return item;
        } // transverse the array to find if product to be added in the array already exist in the cart
      }); //  console.log(item);
      console.log(product);
      // ADD TO CART SECTION
      // CHECK IF PRODUCT ALREADY IN CART
      if (product) {
        console.log("product already exists in cart");

        let quantity = parseInt(req.body.quantity);
        // convert product quantity to a number

        product.quantity += quantity || 1;
        // it's add specified quantity of product or adds 1 if quantity not specified
        product.subtotal = product.quantity * productExist.price;

        cart.itemCount = checkQuantity(cart.products);
        cart.totalPrice = parseInt(getSubtotal(cart.products));
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
          productID: req.body.productId,
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
      console.log(productExist);
      // console.log(first)
      const cart = new Cart({
        _id: user._id,

        products: [
          {
            productID: req.body.productId,
            product: req.body.productId,
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
  } catch (error) {
    console.log(error);
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
      _id: req.body.productId,
    }); //check if product to be removed from the cart exists in the store

    if (!productExist) {
      return res
        .status(404)
        .json({
          success: false,
          message: "product to be removed from cart not found in store",
        }); //if product doesn't exist return the json response above
    }

    const cart = await Cart.findOne({ _id: user._id }); // find the user's cart

    if (cart) {
      console.log("user has a cart");

      // check if product already exists in cart
      let product = cart.products.find((item) => {
        if (item.productID === req.body.productId) {
          // console.log(item)
          return item;
        }
      });
      // REMOVE TO CART SECTION
      // CHECK IF PRODUCT ALREADY IN CART
      if (product != undefined) {
        // console.log(product, "product already exists in cart");

        let quantity = parseInt(req.body.quantity); // convert product quantity to a number
        if (cart.products.length === 1 && product.quantity === 1) {
          await Cart.findOneAndDelete({ _id: user._id });
        }
        if (product.quantity == 1) {
          cart.products.splice(cart.products.indexOf(product), 1);
          product.subtotal = product.quantity * productExist.price;
          console.log(typeof product.subtotal);
          cart.itemCount = checkQuantity(cart.products);
          cart.totalPrice = getSubtotal(cart.products);
        } else {
          product.quantity -= quantity || 1;
          console.log(product.quantity);
          // it's subtracts specified quantity of product or subtracts 1 if quantity not specified
          product.subtotal = product.quantity * productExist.price;
          console.log(typeof product.subtotal);
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
          .json({
            success: false,
            message: "cannot delete, this product is not in your cart ",
          });
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
      _id: req.params.id,
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
    const deletedCart = await Cart.findOneAndDelete({ _id: req.params.id });
    if (!deletedCart) {
      res.status(404).json({
        success: false,
        message: " cart not found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "cart deleted successfully",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getCart, removeFromCart, addToCart, deleteCart };
