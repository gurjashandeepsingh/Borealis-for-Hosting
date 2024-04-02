import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validTo: {
    type: Date,
    required: true,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

export { Coupon };
