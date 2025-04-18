import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    cuisine: {
      type: [String],
      required: [true, "Cuisine is required"],
      validate: {
        validator: function (arr) {
          return (
            arr.length > 0 && arr.every((item) => typeof item === "string")
          );
        },
        message: "Cuisine must be a non-empty array of strings",
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    minOrder: {
      type: Number,
      default: 0,
      min: [0, "Minimum order must be at least 0"],
    },
    deliveryTime: {
      type: String,
      required: [true, "Delivery time is required"],
      trim: true,
    },
    deliveryFee: {
      type: Number,
      required: [true, "Delivery fee is required"],
      min: [0, "Delivery fee must be at least 0"],
    },
    distance: {
      type: String,
      required: [true, "Distance is required"],
      trim: true,
    },
    isEcoFriendly: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
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

export default mongoose.models.Restaurant ||
  mongoose.model("Restaurant", restaurantSchema);
