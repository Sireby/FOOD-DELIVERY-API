const Order = require("../models/orderModel");
const User = require("../models/user-model");
const Cart = require("../models/cartModel");


// CREATE AN ORDER
const createOrder =  async (req, res) => {
  try {
         const userId = req.params.userId;
         const user = await User.findById(userId); 
         if(user)
         {
          const orderCart = await Cart.findOne({
            cartId: req.body.cartId
          });
          const newOrder = new Order({
            userId: userId , 
            cart:  [orderCart],
            address: req.body.address,
            phoneNumber: req.body.phoneNumber
          });
          const savedOrder = await newOrder.save();
          const reqBody = req.body.cartId
          const deletedCart = await Cart.findOneAndDelete(reqBody);
          if(!deletedCart)
          {
            return res.status(400).json({
              message: "Cart cannot be deleted!"
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
            console.log(err) 
            return res.status(500).json(err);
            }                                                                                                       
          };


 //UPDATE ORDER
 const updateOrder = async (req, res) => {
  try {
    const id = req.params.userId;
    const order = await Order.findOne({id});
    console.log(order)
    if(order)
         {
          order.address = req.body.address;
          await order.save();
          return res.status(200).send({
               status: true,
               message: "Order has been updated successfully",
               updatedOrder: updateOrder,
             })
            
            }else
          {
           return res.status(404).json({
             message: "Order Not Found! "
          })
             }
        }catch (err) {
          console.log(err)
          return res.status(500).json(err);
        
      }}
    
       

 //DELETE AN ORDER
 const deleteOrder = async (req, res) => {
    try {
      
      const { userId} = req.params;
      const orderId = req.body.orderId;
      const user = await User.findById(userId);
      if(!user)
        {
          return res.status(400).json({
            message: "Invalid User ID! "
          })
        }
      const order = await Order.findById(orderId); 
        if (!order) {
            return res.status(400).json({
                status: 'fail',
                message: `Order with Id: ${orderId} does not exist!`
            })
        }else{
       await Order.findByIdAndDelete(orderId)
       return  res.status(200).json({
            message: 'Order deleted successfully'
        })}
    } 
    catch (err) {
       return res.status(400).json({
            status: 'fail',
            message: err
        })
    }
  }


// GET ONE USER ORDER
const getUserOrder = async (req, res) => {
    try {
      const {userId } = req.params;
      const user = await User.findById(userId);
      if(!user)
        {
          return res.status(400).json({
            message: "Invalid User! "
          })
        }
        const order = await Order.findOne({userId})
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
        const order = await Order.find({});
        res.status(200).json({
            message: "All Orders have been retrieved!",
            data: [order],
            results: order.length
          });
      } catch (err) {
        res.status(404).json({
            message: " Error!",
            data: err});
      }
    };

 module.exports = {createOrder , getAllOrders, getUserOrder, updateOrder, deleteOrder}