const Order = require("../models/orderModel");
const User = require("../models/user-model");
const Cart = require("../models/cartModel");


    // CREATE ORDER
const createOrder =  async (req, res) => {
  try {
         const userId = request.params.id;
         const user = await User.findById(userId); 
         if(user)
         {
          const newOrder = new Order(req.body);
          const savedOrder = await newOrder.save();
          const deletedCart = await Cart.findByIdAndDelete(userId);
          if(!deletedCart)
          {
            return res.status(400).json({
              message: "Cart cannot be deleted! "
            })
          }
             return res.status(200).json({
                message: "Order created Successfully!",
                return : savedOrder});
         } else{
         return res.status(404).json({
            message: "Invalid User!",
         })
       }
      }
           catch (err) {
             return res.status(500).json(err);
            }
          };




 //UPDATE ORDER
 const updateOrder = async (req, res) => {
  try {
    const {userId , orderId} = req.params;
    const user = await User.findById(userId);
    if(!user)
      {
        return res.status(400).json({
          message: "Invalid User ID!"
        })
      }
      const order = await Order.findOne(orderId);
       if (!order)
       {
        return res.status(404).json({
          message: "Order Not Found! "
       })
      }
      order.address = request.body.address;
      await order.save();
        return response.status(200).send({
          status: true,
          message: "Order has been updated successfully",
          updatedUser: order,
        })
  }catch (err) {
   return res.status(500).json(err);
 }
 }


 //DELETE AN ORDER
 const deleteOrder = async (req, res) => {
    try {
      const {userId , orderId} = req.params;
      const user = await User.findById(userId);
      if(!user)
        {
          return res.status(400).json({
            message: "Invalid User ID! "
          })
        }
      const order = await Order.findOne(orderId);
        if (!order) {
            return res.status(400).json({
                status: 'fail',
                message: `Order with Id: ${orderId} does not exist!`
            })
        }
        await Order.findByIdAndDelete(orderId)
       return  res.status(204).json({
            status: 'Order deleted successfully'
        })
    } 
    catch (err) {
       return res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}


// GET USER ORDER
const getUserOrder = async (req, res) => {
    try {
      const {userId , orderId} = req.params;
      const user = await User.findById(userId);
      if(!user)
        {
          return res.status(400).json({
            message: "Invalid User! "
          })
        }
        const order = await Order.findById(orderId)
        return res.status(200).json({
            data: order
        })
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

 //GET ALL ORDERS
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({
            message: "All Orders have been retrieved!",
            data: orders});
      } catch (err) {
        res.status(404).json({
            message: " Error!",
            data: err});
      }
    };

 module.exports = {createOrder , getAllOrders, getUserOrder, updateOrder, deleteOrder}