import { connectToDatabase } from "@/libs/db/mongo";
import Order from "@/models/Order";
import admin from "@/libs/firebaseAdmin";
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
    throw error;
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const decoded = await getAuthenticatedUser(req);

    const orders = await Order.find({ userUid: decoded.uid })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Fetched ${orders.length} orders for user ${decoded.uid}`);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
