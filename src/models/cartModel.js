const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: [true, "input a valid userId"] },
    products: [
      {
        productId: {
          type: String,
        },
        productName: {
          type: String,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        subtotal: {
          type: Number,
          default: this.quantity * this.productPrice,
        },
      },
    ],
    itemCount: { type: Number, required: true, default: this.products.length },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
