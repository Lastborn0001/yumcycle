import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    photoURL: { type: String },
    location: { type: String },
    role: {
      type: String,
      enum: ["user", "restaurant", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
