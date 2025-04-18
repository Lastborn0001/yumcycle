import { connectToDatabase } from "@/libs/db/mongo";
import RestaurantProfile from "@/models/RestaurantProfile";
import Notification from "@/models/Notification";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";

async function verifyRestaurantOwner(token) {
  console.log(
    "Verifying token for notifications:",
    token?.slice(0, 20) + "..."
  );
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decoded.uid });
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
  console.log("Handling GET /api/restaurants/notifications");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      console.log("No token provided");
      throw new Error("Authorization token missing");
    }

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    const restaurant = await RestaurantProfile.findOne({ userId: uid }).lean();
    if (!restaurant) {
      console.log("Restaurant not found for uid:", uid);
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }

    console.log("Querying notifications for restaurant:", restaurant._id);
    const notifications = await Notification.find({
      restaurant: restaurant._id,
    }).lean();
    console.log("Notifications found:", notifications.length);

    return Response.json(notifications, { status: 200 });
  } catch (error) {
    console.error(
      "Error fetching notifications:",
      JSON.stringify(error, null, 2)
    );
    return Response.json(
      { error: error.message || "Failed to fetch notifications" },
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

export async function PUT(req) {
  console.log("Handling PUT /api/restaurants/notifications");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) throw new Error("Authorization token missing");

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    const restaurant = await RestaurantProfile.findOne({ userId: uid }).lean();
    if (!restaurant) {
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const { id } = await req.json();
    if (!id) {
      return Response.json(
        { error: "Missing notification id" },
        { status: 400 }
      );
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, restaurant: restaurant._id },
      { read: true },
      { new: true }
    ).lean();

    if (!notification) {
      return Response.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return Response.json(notification, { status: 200 });
  } catch (error) {
    console.error(
      "Error updating notification:",
      JSON.stringify(error, null, 2)
    );
    return Response.json(
      { error: error.message || "Failed to update notification" },
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
