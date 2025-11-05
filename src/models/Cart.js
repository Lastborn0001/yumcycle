import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    restaurantName: { type: String, required: true },
    image: String,
    category: String,
    description: String,
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userUid: { type: String, required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
