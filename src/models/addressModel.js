import mongoose, { mongo } from "mongoose";

const addressSchema = new mongoose.Schema({
  pincode: {
    type: Number,
    minlength: 6,
    maxlength: 6,
    require: true,
  },
  flatNumber: {
    type: String,
    require: true,
  },
  floor: {
    type: String,
    require: true,
  },
  line1: {
    type: String,
    require: true,
  },
  line2: {
    type: String,
  },
  city: {
    type: String,
    require: true,
  },
  state: {
    type: String,
    require: true,
  },
});

const Address = new mongoose.model("Address", addressSchema);

export { Address };
