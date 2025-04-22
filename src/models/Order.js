import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    restaurantId: { type: String, required: true },
    restaurantName: { type: String, required: true },
    image: String,
    category: String,
    description: String,
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userUid: { type: String, required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 30 },
    serviceFee: { type: Number, default: 40 },
    tax: { type: Number, default: 300 },
    tip: { type: Number, default: 400 },
    donation: { type: Number, default: 2 },
    total: { type: Number, required: true },
    paymentIntentId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
