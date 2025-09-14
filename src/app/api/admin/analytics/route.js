import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { connectToDatabase } from "@/libs/db/mongo";
import User from "@/models/User";
import RestaurantProfile from "@/models/RestaurantProfile";

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// Verify admin role
const verifyAdmin = async (token) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    await connectToDatabase();

    const user = await User.findOne({ uid: decodedToken.uid });
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
    return user;
  } catch (error) {
    throw new Error("Authentication failed");
  }
};

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    await verifyAdmin(token);

    await connectToDatabase();

    // Get counts by role from User collection
    const userCount = await User.countDocuments({ role: "user" });
    const restaurantCount = await User.countDocuments({ role: "restaurant" });

    // Get restaurant counts by status from RestaurantProfile collection
    const approvedCount = await RestaurantProfile.countDocuments({
      status: "approved",
    });
    const rejectedCount = await RestaurantProfile.countDocuments({
      status: "rejected",
    });
    const pendingCount = await RestaurantProfile.countDocuments({
      status: "pending",
    });

    return NextResponse.json({
      roles: {
        users: userCount,
        restaurants: restaurantCount,
      },
      restaurantStatuses: {
        approved: approvedCount,
        rejected: rejectedCount,
        pending: pendingCount,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
