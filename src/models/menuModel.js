import mongoose, { mongo } from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Menu = new mongoose.model("Menu", menuSchema);
export { Menu };
