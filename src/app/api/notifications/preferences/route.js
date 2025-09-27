import { connectToDatabase } from "@/libs/db/mongo";
import UserNotification from "@/models/UserNotification";
import admin from "@/libs/firebaseAdmin";
import { sendEmail } from "@/libs/utils/sendEmail";

export async function PUT(req) {
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
    }

    const body = await req.json();
    const { type, enabled } = body;

    if (!type || typeof enabled !== "boolean") {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Update notification preferences
    userNotification.preferences[type] = enabled;
    userNotification.preferences.lastUpdated = new Date();
    await userNotification.save();

    // Send email if email notifications are enabled and preference was enabled
    if (enabled && userNotification.preferences.email) {
      try {
        const userRecord = await admin.auth().getUser(decodedToken.uid);
        if (!userRecord.email) {
          throw new Error("User email not found in Firebase Auth");
        }
        const emailSubject = "Notification Preferences Updated";
        const emailText = `You have successfully ${
          enabled ? "enabled" : "disabled"
        } ${type} notifications on YumCycle.`;

        await sendEmail({
          to: userRecord.email,
          subject: emailSubject,
          text: emailText,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #f97316;">Notification Settings Updated</h2>
              <p style="font-size: 16px; color: #4b5563;">
                Hello ${userRecord.displayName || "there"},
              </p>
              <p style="font-size: 16px; color: #4b5563;">
                ${emailText}
              </p>
              <p style="font-size: 14px; color: #6b7280;">
                If you didn't make this change, please contact support immediately.
              </p>
            </div>
          `,
        });
        console.log(
          `Email sent to ${userRecord.email} for ${type} notification update`
        );
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
        // Log the error but don't fail the request
      }
    }

    return Response.json(userNotification, { status: 200 });
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return Response.json(
      { error: error.message || "Failed to update notification preferences" },
      { status: 500 }
    );
  }
}
