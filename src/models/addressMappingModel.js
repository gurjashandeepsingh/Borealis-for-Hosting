import mongoose from "mongoose";

const addressMappingSchema = new mongoose.Schema(
  {
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    entityType: {
      type: String,
      enum: ["User", "Vendor"],
      require: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      require: true,
    },
  },
  { timestamps: true }
);

const AddressMap = new mongoose.model("AddressMap", addressMappingSchema);
export { AddressMap };
