import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
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
      required: [true, "Rating is required"],
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    minOrder: {
      type: Number,
      required: [true, "Minimum order is required"],
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
      required: [true, "Eco-friendly status is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default mongoose.models.Restaurant ||
  mongoose.model("Restaurant", restaurantSchema);
