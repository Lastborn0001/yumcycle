// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { connectToDatabase } from "@/libs/db/mongo";
import User from "@/models/User";

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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const limit = parseInt(searchParams.get("limit")) || 100;
    const skip = parseInt(searchParams.get("skip")) || 0;

    // Build query
    let query = {};
    if (role && role !== "all") {
      query.role = role;
    }

    // Fetch users with pagination
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);

    return NextResponse.json({
      users,
      pagination: {
        total: totalUsers,
        limit,
        skip,
        hasMore: skip + limit < totalUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const { action, userId, updates } = await request.json();

    if (!action || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    switch (action) {
      case "update_role":
        if (!updates?.role) {
          return NextResponse.json(
            { error: "Role is required for update" },
            { status: 400 }
          );
        }

        await User.findOneAndUpdate(
          { uid: userId },
          { role: updates.role },
          { new: true }
        );
        break;

      case "suspend":
        await User.findOneAndUpdate(
          { uid: userId },
          { suspended: true, suspendedAt: new Date() }
        );

        // Optionally disable user in Firebase Auth
        try {
          await getAuth().updateUser(userId, { disabled: true });
        } catch (firebaseError) {
          console.error("Failed to disable user in Firebase:", firebaseError);
        }
        break;

      case "unsuspend":
        await User.findOneAndUpdate(
          { uid: userId },
          { suspended: false, $unset: { suspendedAt: 1 } }
        );

        // Optionally enable user in Firebase Auth
        try {
          await getAuth().updateUser(userId, { disabled: false });
        } catch (firebaseError) {
          console.error("Failed to enable user in Firebase:", firebaseError);
        }
        break;

      case "delete":
        await User.findOneAndDelete({ uid: userId });

        // Optionally delete user from Firebase Auth
        try {
          await getAuth().deleteUser(userId);
        } catch (firebaseError) {
          console.error("Failed to delete user from Firebase:", firebaseError);
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `User ${action} completed successfully`,
    });
  } catch (error) {
    console.error(`Error performing user ${action}:`, error);
    return NextResponse.json(
      { error: error.message || `Failed to ${action} user` },
      { status: 500 }
    );
  }
}
