import { connectToDatabase } from "@/libs/db/mongo";
import admin from "@/libs/firebaseAdmin";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) throw new Error("Authorization token missing");

    // Verify the user
    const decoded = await admin.auth().verifyIdToken(token);

    await connectToDatabase();

    // Find the order and verify ownership
    const order = await Order.findOne({
      _id: params.orderId,
      userUid: decoded.uid,
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    // Update order status to completed
    order.status = "completed";
    await order.save();

    return NextResponse.json(
      { message: "Order delivery confirmed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Confirm delivery error:", error);
    return NextResponse.json(
      { error: "Failed to confirm delivery" },
      { status: 500 }
    );
  }
}
