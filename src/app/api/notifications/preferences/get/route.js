// src/app/api/notifications/preferences/get/route.js
import { connectToDatabase } from "@/libs/db/mongo";
import UserNotification from "@/models/UserNotification";
import admin from "@/libs/firebaseAdmin";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      return Response.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Verify the user's token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Get or create notification settings
    let userNotification = await UserNotification.findOne({
      userId: decodedToken.uid,
    });

    if (!userNotification) {
      // Create default notification settings if they don't exist
      userNotification = new UserNotification({
        userId: decodedToken.uid,
        preferences: {
          surplus: false,
          discounts: false,
          restaurants: false,
          email: true,
          lastUpdated: new Date(),
        },
        notifications: [],
      });
      await userNotification.save();
    }

    // Return the user's notification preferences
    return Response.json(
      {
        notificationPreferences: userNotification.preferences || {
          surplus: false,
          discounts: false,
          restaurants: false,
          email: true,
          lastUpdated: new Date(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return Response.json(
      { error: error.message || "Failed to fetch notification preferences" },
      { status: 500 }
    );
  }
}
