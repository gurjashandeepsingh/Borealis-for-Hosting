import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator: function (value) {
          // Regular expression to validate email format
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address",
      },
    },
    phone: {
      type: Number,
      require: true,
      minlength: 10,
      maxlength: 10,
    },
    password: {
      type: String,
      minlength: 8,
    },
    isDeleted: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);

export { User };
