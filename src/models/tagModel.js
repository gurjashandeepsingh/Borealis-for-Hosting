import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Tag = new mongoose.model("Tag", tagSchema);
export { Tag };
