import mongoose from "mongoose";

const restaurantProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  location: { type: String },
  cuisine: [{ type: String }],
  rating: { type: Number, default: 0 },
  minOrder: { type: Number, default: 0 },
  deliveryTime: { type: String },
  deliveryFee: { type: Number, default: 0 },
  distance: { type: String },
  isEcoFriendly: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

export default mongoose.models.RestaurantProfile ||
  mongoose.model("RestaurantProfile", restaurantProfileSchema);
