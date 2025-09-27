import { connectToDatabase } from "@/libs/db/mongo";
import UserNotification from "@/models/UserNotification";
import { sendEmail } from "@/libs/utils/sendEmail";
import admin from "@/libs/firebaseAdmin";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      return Response.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const { type, message, title } = body;

    if (!type || !message || !title) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the user's token
    const decodedToken = await admin.auth().verifyIdToken(token);
    let userNotification = await UserNotification.findOne({
      userId: decodedToken.uid,
    });

    if (!userNotification) {
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

    // Check if the user has enabled this type of notification
    if (!userNotification.preferences[type]) {
      return Response.json(
        {
          message: `This notification type (${type}) is disabled for the user`,
        },
        { status: 200 }
      );
    }

    // Add the notification to the user's history
    const notification = {
      type,
      title,
      message,
      isRead: false,
      createdAt: new Date(),
    };

    await UserNotification.findByIdAndUpdate(userNotification._id, {
      $push: { notifications: notification },
    });

    // Send email if email notifications are enabled
    if (userNotification.preferences.email) {
      try {
        const userRecord = await admin.auth().getUser(decodedToken.uid);
        await sendEmail({
          to: userRecord.email,
          subject: title,
          text: message,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #f97316;">${title}</h2>
              <p style="font-size: 16px; color: #4b5563;">
                Hello ${userRecord.displayName || "there"},
              </p>
              <p style="font-size: 16px; color: #4b5563;">
                ${message}
              </p>
              <p style="font-size: 14px; color: #6b7280;">
                You received this email because you have enabled ${type} notifications on YumCycle.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
    }

    return Response.json(
      {
        message: "Notification sent successfully",
        notification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return Response.json(
      { error: error.message || "Failed to send notification" },
      { status: 500 }
    );
  }
}
