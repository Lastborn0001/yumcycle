import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    preferences: {
      surplus: { type: Boolean, default: false },
      discounts: { type: Boolean, default: false },
      restaurants: { type: Boolean, default: false },
      email: { type: Boolean, default: true },
    },
    lastUpdated: { type: Date, default: Date.now },
    notifications: [
      {
        type: {
          type: String,
          enum: ["surplus", "discounts", "restaurants", "system"],
          required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Create a compound index to ensure one notification settings per user
userNotificationSchema.index({ userId: 1 }, { unique: true });

export default mongoose.models.UserNotification ||
  mongoose.model("UserNotification", userNotificationSchema);
