import mongoose from "mongoose";

const restaurantProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Store Firebase UID as a string
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
    },
    address: {
      type: String,
      required: [true, "Restaurant address is required"],
    },
    cuisine: {
      type: [String],
      required: [true, "Cuisine types are required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RestaurantProfile ||
  mongoose.model("RestaurantProfile", restaurantProfileSchema);
