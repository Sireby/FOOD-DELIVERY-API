const Cart = require("../models/cartModel");
const User = require("../models/user-model");
const Menu = require("../models/menuModel");

const checkQuantity = (menuItem) => {
  let quantity = 0;
  for (let index = 0; index < menuItem.length; index++) {
    const product = menuItem[index];
    quantity += product.quantity;
  }
  return quantity;
};
const getSubtotal = (menuItem) => {
  let subtotal = 0;
  for (let index = 0; index < menuItem.length; index++) {
    const item = menuItem[index];
    subtotal += item.subtotal;
  }
  return subtotal;
};

const addToCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized USer!" });
    }

    const menuItemExist = await Menu.findOne({
      _id: req.body.foodId,
    }); 

    if (!menuItemExist) {
      return res.status(404).json({
        success: false,
        message: "Item is not on the menu! ",
      }); 
    }

    const cart = await Cart.findOne({ _id: user._id }); 

    if (cart) {
      let foodItem = cart.menuItem.find((item) => {
        if (item.foodID === req.body.foodId) {
          return item;
        } // transverse the array to find if product to be added in the array already exist in the cart
      });

      // CHECK IF PRODUCT ALREADY IN CART
      if (foodItem) {
        console.log("Item already exists in cart! ");

        let quantity = parseInt(req.body.quantity);
        // convert product quantity to a number

        foodItem.quantity += quantity || 1;
        // it's add specified quantity of product or adds 1 if quantity not specified
        foodItem.subtotal = foodItem.quantity * menuItemExist.price;

        cart.itemCount = checkQuantity(cart.menuItem);
        cart.totalPrice = parseInt(getSubtotal(cart.menuItem));
        cart.save(cart, (err, cart) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: err.message,
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Cart updated",
              cart: cart,
            });
          }
        });
      } else {
        // user has cart but doesnt have product in his cart
        console.log(" No Items In Cart!");

        cart.menuItem.push({
          food: req.body.foodId,
          quantity: req.body.quantity || 1,
          subtotal: menuItemExist.price * (req.body.quantity || 1),
        });
        cart.itemCount = checkQuantity(cart.menuItem);
        cart.quantity = getSubtotal(cart.menuItem);
        cart.save((err, cart) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: err.message,
            });
          } else {
            return res.status(200).json({
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
      console.log("Cart is empty, Add items!");

      const cart = new Cart({
        _id: user._id,

        menuItem: [
          {
            //foodID: req.body.foodId,
            food: req.body.foodId,
            quantity: req.body.quantity || 1,
            price: menuItemExist.price,
            subtotal: menuItemExist.price * (req.body.quantity || 1),
          },
        ],
        itemCount: req.body.quantity || 1,
        totalPrice: menuItemExist.price * (req.body.quantity || 1),
      });
      cart.save((err, cart) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "Cart created!",
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



//REMOVE ITEM FROM CART
const removeFromCart = async (req, res) => {
  try {
    // const userID = req.params.id;
    // const user = req.user; // identify the user
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    const menuItemExist = await Menu.findOne({
      _id: req.body.foodId,
    }); //check if item to be removed from the cart is on the menu

    if (!menuItemExist) {
      return res.status(404).json({
        success: false,
        message: " Item is sold out! ",
      }); //if item doesn't exist return the json response above
    }

    const cart = await Cart.findOne({ _id: user._id }); 

    if (cart) {
      console.log("user has a cart");

      // check if item already exists in cart
      let foodItem = cart.menuItem.find((item) => {
        if (item.foodID === req.body.foodId) {
          return item;
        }
      });


    
      // REMOVE TO CART SECTION
      // CHECK IF PRODUCT ALREADY IN CART
      if ( foodItem != undefined) {
        let quantity = parseInt(req.body.quantity); // convert product quantity to a number
        if (cart.menuItem.length === 1 && foodItem.quantity === 1) {
          await Cart.findOneAndDelete({ _id: user._id });
          return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully!",
            cart: cart,
          });
        }
        if (foodItem.quantity == 1) {
          cart.menuItem.splice(cart.menuItem.indexOf(foodItem), 1);
          foodItem.subtotal = foodItem.quantity * menuItemExist.price;
          cart.itemCount = checkQuantity(cart.menuItem);
          cart.totalPrice = getSubtotal(cart.menuItem);
        } else {
          foodItem.quantity -= quantity || 1;
          // it's subtracts specified quantity of product or subtracts 1 if quantity not specified
          foodItem.subtotal = foodItem.quantity * menuItemExist.price;
          cart.itemCount = checkQuantity(cart.menuItem);
          cart.totalPrice = getSubtotal(cart.menuItem);
        }
        cart.save(cart, (err, cart) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: err,
            });
          } else {
            return res.status(200).json({
              success: true,
              message: "Item removed from cart successfully!",
              cart: cart,
            });
          }
        });
      } else {
        res.status(409).json({
          success: false,
          message: "Cannot remove Item!",
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


//GET  USER CART
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }
    // check if cart exists
    let cart = await Cart.findOne({
      _id: user.id,
    });
    if (cart) {
      return res.json({
        success: true,
        message: "Cart retrieved",
        cart: cart,
      });
    } else {
      return res.json({
        success: false,
        message: "Cart does not exist",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "server Error: " + error.message, success: false });
  }
};



const deleteCart = async (req, res) => {
  try {
    // check if cart exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }
    const deletedCart = await Cart.findOneAndDelete({ _id: user.id });
    if (!deletedCart) {
      return res.status(404).json({
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

module.exports = {
  getCart,
  removeFromCart,
  addToCart,
  deleteCart,
  getSubtotal,
  checkQuantity,
};