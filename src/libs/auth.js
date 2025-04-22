import admin from "@/libs/firebaseAdmin";
import { connectToDatabase } from "@/libs/db/mongo";
import User from "@/models/User";

export async function verifyUser(token) {
  console.log("Verifying token for user:", token?.slice(0, 20) + "...");
  try {
    await connectToDatabase();
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      throw new Error("User not found");
    }
    return { user, uid: decoded.uid };
  } catch (error) {
    console.error("Verification error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(error.message || "Invalid or expired token");
  }
}
