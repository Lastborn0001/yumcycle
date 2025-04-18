import { connectToDatabase } from "@/libs/db/mongo";
import RestaurantProfile from "@/models/RestaurantProfile";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Middleware to verify admin role
async function verifyAdmin(token) {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (decoded.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "pending";

  try {
    // Verify admin
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) throw new Error("Authorization token missing");
    await verifyAdmin(token);

    await connectToDatabase();

    // Fetch restaurants
    const restaurants = await RestaurantProfile.find({ status }).lean();

    // Manually populate userId
    const restaurantIds = restaurants.map((r) => r.userId);
    const users = await User.find({ uid: { $in: restaurantIds } })
      .select("name email uid")
      .lean();

    // Map users to restaurants
    const userMap = new Map(users.map((user) => [user.uid, user]));
    const populatedRestaurants = restaurants.map((restaurant) => ({
      ...restaurant,
      userId: userMap.get(restaurant.userId) || null, // Null if no matching user
    }));

    return Response.json(populatedRestaurants, { status: 200 });
  } catch (error) {
    console.error(
      "Error fetching restaurants:",
      JSON.stringify(error, null, 2)
    );
    return Response.json(
      { error: error.message || "Failed to fetch restaurants" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function POST(req) {
  try {
    // Verify admin
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) throw new Error("Authorization token missing");
    await verifyAdmin(token);

    const { action, restaurantId, userId } = await req.json();

    if (!action || !restaurantId || !userId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    if (action === "approve") {
      // Update RestaurantProfile and User status to "approved"
      const [restaurant, user] = await Promise.all([
        RestaurantProfile.findByIdAndUpdate(
          restaurantId,
          { status: "approved" },
          { new: true }
        ),
        User.findOneAndUpdate(
          { uid: userId }, // Query by Firebase UID
          { status: "approved" },
          { new: true }
        ),
      ]);

      if (!restaurant || !user) {
        return Response.json(
          { error: "Restaurant or user not found" },
          { status: 404 }
        );
      }

      return Response.json({ success: true }, { status: 200 });
    } else if (action === "reject") {
      // Update RestaurantProfile and User status to "rejected"
      const [restaurant, user] = await Promise.all([
        RestaurantProfile.findByIdAndUpdate(
          restaurantId,
          { status: "rejected" },
          { new: true }
        ),
        User.findOneAndUpdate(
          { uid: userId }, // Query by Firebase UID
          { status: "rejected" },
          { new: true }
        ),
      ]);

      if (!restaurant || !user) {
        return Response.json(
          { error: "Restaurant or user not found" },
          { status: 404 }
        );
      }

      return Response.json({ success: true }, { status: 200 });
    } else if (action === "delete") {
      // Delete RestaurantProfile, User, and Firebase user
      const [restaurant, user] = await Promise.all([
        RestaurantProfile.findByIdAndDelete(restaurantId),
        User.findOneAndDelete({ uid: userId }), // Query by Firebase UID
        admin.auth().deleteUser(userId), // Firebase user deletion
      ]);

      if (!restaurant || !user) {
        return Response.json(
          { error: "Restaurant or user not found" },
          { status: 404 }
        );
      }

      return Response.json({ success: true }, { status: 200 });
    } else {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing request:", JSON.stringify(error, null, 2));
    return Response.json(
      { error: error.message || "Failed to process request" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
