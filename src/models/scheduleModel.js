import mongoose from "mongoose";

const scheduleSchema = mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  day: {
    type: String,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  openingTime: {
    type: Number,
  },
  closingTime: {
    type: Number,
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export { Schedule };
