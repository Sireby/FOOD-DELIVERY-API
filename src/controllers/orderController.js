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
          
          const reqBody = req.body.cartId
          const deletedCart = await Cart.findOneAndDelete(reqBody);
          if(!deletedCart)
          {
            return res.status(400).json({
              message: "Cart cannot be deleted!"
            })
          }
          const savedOrder = await newOrder.save();
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
      const order = await Order.findOne({ userId: orderId }); 
        if (!order) {
          console.log(order)
            return res.status(400).json({
                status: 'fail',
                message: `Order with Id: ${orderId} does not exist!`
            })
        }else{
          console.log(order);
       await Order.findOneAndDelete({userId: orderId})
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

    const checkoutOrder = async (req, res) => {
      try {
          // const userId = req.user.id;

          const userId  = req.params.userId;
          const user = await User.findById(userId);
          let payload = req.body;
          
          let cart = await Order.findOne({userId});
        //let user = req.user;
          
          if(cart) {
              payload = {...payload, enckey: process.env.FLW_ENCRYPTION_KEY, amount : cart.totalPrice};
              const response = await flw.Charge.card(payload);
             
              if (response.meta.authorization.mode === 'pin') {
                let payload2 = payload
                payload2.authorization = {
                    "mode": "pin",
                    "fields": [
                        "pin"
                    ],
                    "pin": 3310
                }
                const reCallCharge = await flw.Charge.card(payload2)
// Add the OTP to authorize the transaction
                const callValidate = await flw.Charge.validate({
                    "otp": "12345",
                    "flw_ref": reCallCharge.data.flw_ref
                })
                
                if(callValidate.status === 'success') {
                                    
                let order = await Order.findOne({userId});
                let cartItems = await Cart.find({userId});
                if (cartItems) {
                  cartItems.map(async cartItem => {
                    await Cart.findByIdAndDelete(cartItem._id);
                }) 
            }
            
            let mail = nodemailer.createTransport({
                service : 'gmail',
                auth : {
                    user : process.env.EMAIL_HOST,
                    pass : process.env.EMAIL_PASS
                }
            });
let mailOptions = {
                from : process.env.EMAIL_HOST,
                to : "nicoleojieabu@gmail.com",
                subject : "Orders",
                text : JSON.stringify(order)
            }
mail.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent : ' + info.response);
                }
            })
            return res.status(201).send({
                status : "Payment successfully made",
                message : "Your orders has been received",
                order,
                mailOptions
            })
            } 
            if(callValidate.status === 'error') {
                res.status(400).send("please try again");
            }
            else {
                res.status(400).send("payment failed");
            }
        }
if (response.meta.authorization.mode === 'redirect') {

            var url = response.meta.authorization.redirect
            open(url)
        }
    } else {
        res.status(400).send("Cart not found");
    }
  }catch(err){


  }
}


 module.exports = {createOrder , getAllOrders, getUserOrder, updateOrder, deleteOrder, checkoutOrder}
 