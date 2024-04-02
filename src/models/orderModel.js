import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    amount: {
      type: Number,
      require: true,
    },
    items: {
      type: Array,
      require: true,
    },
    userId: {
      type: String,
      require: true,
      trim: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    paymentInfo: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export { Order };
