const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema(
  {
   userId: { type: String, //mongoose.Schema.Types.ObjectId, 
    required: [true, "Input a valid userId"] },



    cart : 
      [{
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: "Cart",
        autopopulate: true
      }],
    
  
    // price: { type: Number,
    //   required: true },


    // totalAmount: {
    //           type: Number,
    //           required: true},

    address: { type: String,
               required: true },

    status: { type: String, 
              default: "pending" },
  },
  { timestamps: true }
);

OrderSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Order", OrderSchema);