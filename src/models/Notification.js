import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    restaurantId: { type: String, required: true },
    orderId: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    orderDetails: {
      userUid: { type: String, required: true },
      items: [
        {
          _id: { type: String, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, default: 1 },
          restaurantName: { type: String, required: true },
        },
      ],
      subtotal: { type: Number, required: true },
      total: { type: Number, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
