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
  console.log("Handling GET /api/restaurant");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      console.log("No token provided");
      throw new Error("Authorization token missing");
    }

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    console.log("Querying restaurant for uid:", uid);
    const restaurant = await RestaurantProfile.findOne({ userId: uid }).lean();
    if (!restaurant) {
      console.log("Restaurant not found for uid:", uid);
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }

    console.log("Restaurant found:", restaurant._id);
    return Response.json(restaurant, { status: 200 });
  } catch (error) {
    console.error(
      "Error fetching restaurant data:",
      JSON.stringify(error, null, 2)
    );
    return Response.json(
      { error: error.message || "Failed to fetch restaurant data" },
      {
        status: error.message.includes("Unauthorized")
          ? 403
          : error.message.includes("not found")
          ? 404
          : 500,
      }
    );
  }
}
