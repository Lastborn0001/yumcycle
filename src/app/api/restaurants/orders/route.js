import { connectToDatabase } from "@/libs/db/mongo";
import RestaurantProfile from "@/models/RestaurantProfile";
import Order from "@/models/Order";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";

async function verifyRestaurantOwner(token) {
  // console.log("Verifying token for orders:", token?.slice(0, 20) + "...");
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
  // console.log("Handling GET /api/restaurants/orders");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      // console.log("No token provided");
      throw new Error("Authorization token missing");
    }

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    const restaurant = await RestaurantProfile.findOne({ userId: uid }).lean();
    if (!restaurant) {
      // console.log("Restaurant not found for uid:", uid);
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // console.log("Querying orders for restaurant:", restaurant._id.toString());
    const orders = await Order.find({ restaurantId: restaurant._id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();
    // console.log(
    //   "Orders found:",
    //   orders.length,
    //   "Order IDs:",
    //   orders.map((o) => o._id.toString())
    // );

    return Response.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", JSON.stringify(error, null, 2));
    return Response.json(
      { error: error.message || "Failed to fetch orders" },
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
  // console.log("Handling PUT /api/restaurants/orders");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) throw new Error("Authorization token missing");

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    const restaurant = await RestaurantProfile.findOne({ userId: uid }).lean();
    if (!restaurant) {
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }

    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return Response.json(
        { error: "Missing orderId or status" },
        { status: 400 }
      );
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, restaurantId: restaurant._id },
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ success: true, order }, { status: 200 }); // Add success: true
  } catch (error) {
    console.error("Error updating order:", JSON.stringify(error, null, 2));
    return Response.json(
      { error: error.message || "Failed to update order" },
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
