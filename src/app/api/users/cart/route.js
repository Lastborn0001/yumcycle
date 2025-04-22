import { connectToDatabase } from "@/libs/db/mongo";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";
import { NextResponse } from "next/server";

async function getAuthenticatedUser(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Missing auth token");
  const decoded = await admin.auth().verifyIdToken(token);
  return decoded;
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const decoded = await getAuthenticatedUser(req);

    const user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      return NextResponse.json({ cart: [] });
    }

    return NextResponse.json({ cart: user.cart || [] });
  } catch (err) {
    console.error("GET /api/users/cart error:", err);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
