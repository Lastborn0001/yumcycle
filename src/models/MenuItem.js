import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RestaurantProfile",
      required: [true, "Restaurant is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
      min: [0, "Original price must be at least 0"],
    },
    surplusPrice: {
      type: Number,
      min: [0, "Surplus price must be at least 0"],
      default: null,
    },
    isSurplus: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Main", "Side", "Drink", "Dessert"],
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.MenuItem ||
  mongoose.model("MenuItem", menuItemSchema);
