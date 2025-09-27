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

        // Modern email template with responsive design
        const modernEmailTemplate = `
          <!DOCTYPE html>
          <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>${title}</title>
            <style>
              @media screen and (max-width: 600px) {
                .email-container { width: 100% !important; margin: 0 !important; }
                .header-logo { font-size: 24px !important; }
                .content-padding { padding: 20px !important; }
                .button { width: 100% !important; }
              }
              
              .dark-mode-friendly {
                color-scheme: light dark;
                supported-color-schemes: light dark;
              }
              
              @media (prefers-color-scheme: dark) {
                .email-container { background-color: #1f2937 !important; }
                .content-card { background-color: #374151 !important; color: #f9fafb !important; }
                .footer-text { color: #d1d5db !important; }
              }
            </style>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; line-height: 1.6; margin: 0; padding: 0; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); min-height: 100vh;">
            
            <!-- Email Container -->
            <div class="email-container" style="max-width: 600px; margin: 0 auto; background-color: transparent;">
              
              <!-- Header -->
              <div style="text-align: center; padding: 40px 20px 20px;">
                <div class="header-logo" style="display: inline-block; padding: 15px 25px; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; font-size: 28px; font-weight: bold; border-radius: 16px; box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3); letter-spacing: -0.5px;">
                  YumCycle
                </div>
                <div style="margin-top: 15px; color: #6b7280; font-size: 14px; font-weight: 500;">
                  Food Delivery & Surplus Marketplace
                </div>
              </div>

              <!-- Main Content Card -->
              <div class="content-card" style="background: white; margin: 0 20px; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); border: 1px solid rgba(229, 231, 235, 0.8);">
                
                <!-- Content Header -->
                <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; position: relative;">
                  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23ffffff\" fill-opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>'); opacity: 0.5;"></div>
                  <div style="position: relative; z-index: 1;">
                    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                      ${title}
                    </h1>
                    <div style="width: 60px; height: 3px; background: rgba(255, 255, 255, 0.6); margin: 15px auto; border-radius: 2px;"></div>
                  </div>
                </div>

                <!-- Content Body -->
                <div class="content-padding" style="padding: 40px 30px;">
                  <div style="margin-bottom: 25px;">
                    <p style="font-size: 16px; color: #374151; margin: 0 0 8px 0; font-weight: 600;">
                      Hello ${userRecord.displayName || "there"},
                    </p>
                    <div style="width: 40px; height: 2px; background: linear-gradient(90deg, #f97316, #ea580c); border-radius: 1px; margin-bottom: 20px;"></div>
                  </div>
                  
                  <div style="background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%); border-left: 4px solid #f97316; padding: 20px 25px; border-radius: 12px; margin: 25px 0;">
                    <p style="font-size: 16px; color: #92400e; margin: 0; line-height: 1.6; font-weight: 500;">
                      ${message}
                    </p>
                  </div>

                  ${
                    type === "surplus"
                      ? `
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">🌱</div>
                      <p style="color: #065f46; margin: 0; font-size: 14px; font-weight: 600;">
                        Help reduce food waste while saving money!
                      </p>
                    </div>
                  `
                      : type === "discounts"
                      ? `
                    <div style="background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%); border: 1px solid #fca5a5; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">💰</div>
                      <p style="color: #991b1b; margin: 0; font-size: 14px; font-weight: 600;">
                        Limited time offer - Don't miss out!
                      </p>
                    </div>
                  `
                      : `
                    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #93c5fd; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">🍽️</div>
                      <p style="color: #1e40af; margin: 0; font-size: 14px; font-weight: 600;">
                        Discover new flavors and restaurants!
                      </p>
                    </div>
                  `
                  }
                </div>

                <!-- CTA Section -->
                <div style="padding: 0 30px 40px; text-align: center;">
                  <a href="https://yourapp.com" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3); transition: all 0.3s ease; letter-spacing: 0.25px;">
                    Open YumCycle App
                  </a>
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280;">
                    Or visit our website at <a href="https://yourapp.com" style="color: #f97316; text-decoration: none; font-weight: 600;">yourapp.com</a>
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="text-align: center; padding: 40px 20px;">
                <div style="margin-bottom: 20px;">
                  <div style="display: inline-flex; gap: 15px; margin-bottom: 15px;">
                    <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #f97316; border-radius: 50%; text-align: center; line-height: 40px; color: white; text-decoration: none; font-size: 18px;">📱</a>
                    <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #f97316; border-radius: 50%; text-align: center; line-height: 40px; color: white; text-decoration: none; font-size: 18px;">🐦</a>
                    <a href="#" style="display: inline-block; width: 40px; height: 40px; background: #f97316; border-radius: 50%; text-align: center; line-height: 40px; color: white; text-decoration: none; font-size: 18px;">📘</a>
                  </div>
                </div>
                
                <div class="footer-text" style="color: #9ca3af; font-size: 13px; line-height: 1.5; max-width: 400px; margin: 0 auto;">
                  <p style="margin: 0 0 10px 0;">
                    You received this email because you have enabled <strong>${type}</strong> notifications.
                  </p>
                  <p style="margin: 0 0 15px 0;">
                    <a href="#" style="color: #f97316; text-decoration: none;">Manage notification preferences</a> | 
                    <a href="#" style="color: #f97316; text-decoration: none;">Unsubscribe</a>
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #d1d5db;">
                    © 2024 YumCycle. All rights reserved.<br>
                    Making food delivery sustainable, one meal at a time.
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendEmail({
          to: userRecord.email,
          subject: title,
          text: message,
          html: modernEmailTemplate,
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
