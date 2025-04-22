import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    restaurantId: { type: String, required: true },
    restaurantName: { type: String, required: true },
    image: { type: String, default: "" },
    category: { type: String, default: "general" },
    description: { type: String, default: "" },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
); // Prevent automatic _id for subdocuments

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    cart: {
      type: [cartItemSchema],
      default: [],
      validate: {
        validator: function (cart) {
          // Ensure all items have required fields
          return cart.every(
            (item) =>
              item._id &&
              item.name &&
              item.price &&
              item.restaurantId &&
              item.restaurantName
          );
        },
        message: "Invalid cart items",
      },
    },
  },
  {
    timestamps: true,
    minimize: false, // Prevent Mongoose from removing empty arrays
  }
);

// Create text index for search if needed
userSchema.index({ "cart.name": "text", "cart.description": "text" });

export default mongoose.models.User || mongoose.model("User", userSchema);
