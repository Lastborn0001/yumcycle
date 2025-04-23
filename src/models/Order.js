import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userUid: { type: String, required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestaurantProfile",
    required: true,
  },
  items: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      restaurantName: { type: String, required: true },
      restaurantId: { type: String, required: true }, // String in items
    },
  ],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  serviceFee: { type: Number, required: true },
  tax: { type: Number, required: true },
  tip: { type: Number, required: true },
  donation: { type: Number, required: true },
  total: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  paymentIntentId: { type: String },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
