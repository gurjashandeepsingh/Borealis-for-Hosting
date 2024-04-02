import mongoose from "mongoose";
import validator from "validator";

const cartSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

export { Cart };
