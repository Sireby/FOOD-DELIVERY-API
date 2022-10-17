const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema(
  {
   userId: { type: String, 
    required: [true, "Input a valid userId"] },

    cart : 
      [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        autopopulate: true
      }],


    phoneNumber: {
      type: String,
      required: true
    },
    
    address: { type: String,
               required: true },

    status: { type: String, 
              default: "pending" },
  },
  { timestamps: true }
);

OrderSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Order", OrderSchema);