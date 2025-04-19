import { connectToDatabase } from "@/libs/db/mongo";
import RestaurantProfile from "@/models/RestaurantProfile";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";

async function verifyRestaurantOwner(token) {
  console.log("Verifying token:", token?.slice(0, 20) + "...");
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decoded.uid });
    console.log("User found:", user ? user.uid : "none");
    if (!user || user.role !== "restaurant") {
      throw new Error("Unauthorized: Restaurant owner access required");
    }
    return { user, uid: decoded.uid };
  } catch (error) {
    console.error("Verification error:", error);
    throw new Error(error.message || "Invalid or expired token");
  }
}

export async function GET(req) {
  console.log("Handling GET /api/restaurants");
  try {
    await connectToDatabase();
    const restaurants = await RestaurantProfile.find({
      status: "approved",
    }).lean();
    console.log("Approved restaurants found:", restaurants.length);
    return Response.json(restaurants, { status: 200 });
  } catch (error) {
    console.error("Error fetching restaurants:", error.message, error.stack);
    return Response.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
