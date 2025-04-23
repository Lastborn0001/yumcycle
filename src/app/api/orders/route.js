import { connectToDatabase } from "@/libs/db/mongo";
import admin from "@/libs/firebaseAdmin";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

async function getAuthenticatedUser(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) throw new Error("Authorization token missing");
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("Authenticated user:", decoded);
    return decoded;
  } catch (error) {
    console.error("getAuthenticatedUser error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const user = await getAuthenticatedUser(req);
    if (user instanceof NextResponse) return user;

    // Fetch orders for this user
    const orders = await Order.find({ userUid: user.uid })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Fetched ${orders.length} orders for user ${user.uid}`);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
