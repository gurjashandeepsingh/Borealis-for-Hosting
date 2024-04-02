import mongoose from "mongoose";

const businessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      require: true,
      minlength: 3,
      maxlength: 50,
    },
    chefName: {
      type: String,
      require: true,
      minlength: 3,
    },
    email: {
      type: String,
      unique: true,
      require: true,
      validator: {
        validator: function (value) {
          // Regular expression to validate email format
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      minlength: 8,
    },
    phone: {
      type: Number,
      require: true,
      minlength: 10,
      maxlength: 10,
    },
    address: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      require: false,
      default: null,
    },
    openingTime: {
      type: String,
    },
    closingTime: {
      type: String,
    },
    primaryCuisine: {
      type: Array,
      require: true,
    },
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      require: true,
    },
    veg: {
      type: Boolean,
      default: false,
    },
    nonVeg: {
      type: Boolean,
      default: false,
    },
    vegan: {
      type: Boolean,
      default: false,
    },
    eggitarian: {
      type: Boolean,
      default: false,
    },
    isAcceptingOrders: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Business = new mongoose.model("Business", businessSchema);

export { Business };
