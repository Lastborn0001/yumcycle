// src/app/api/restaurants/menu/route.js
import { connectToDatabase } from "@/libs/db/mongo";
import RestaurantProfile from "@/models/RestaurantProfile";
import MenuItem from "@/models/MenuItem";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";
import UserNotification from "@/models/UserNotification";
import { sendEmail } from "@/libs/utils/sendEmail";
import { uploadImage } from "@/libs/utils/cloudinary";

async function verifyRestaurantOwner(token) {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decoded.uid });
    if (!user || user.role !== "restaurant") {
      throw new Error("Unauthorized: Restaurant owner access required");
    }
    return { user, uid: decoded.uid };
  } catch (error) {
    console.error("Verification error:", error.message, error.stack);
    throw new Error(error.message || "Invalid or expired token");
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (restaurantId) {
      const restaurant = await RestaurantProfile.findOne({
        _id: restaurantId,
        status: "approved",
      });
      if (!restaurant) {
        return Response.json(
          { error: "Restaurant not found or not approved" },
          { status: 404 }
        );
      }
      const menuItems = await MenuItem.find({
        restaurant: restaurantId,
      })
        .populate("restaurant", "name")
        .lean();
      const transformedItems = menuItems.map((item) => ({
        ...item,
        restaurantName: item.restaurant?.name || "Unknown Restaurant",
        originalPrice: item.originalPrice ?? item.price ?? 0,
        surplusPrice: item.surplusPrice ?? null,
      }));
      return Response.json(transformedItems, { status: 200 });
    } else {
      // Fetch surplus items across all approved restaurants
      const menuItems = await MenuItem.find({
        isSurplus: true,
        surplusPrice: { $exists: true, $ne: null },
      })
        .populate("restaurant", "name")
        .lean();
      const transformedItems = menuItems.map((item) => ({
        ...item,
        restaurantName: item.restaurant?.name || "Unknown Restaurant",
        originalPrice: item.originalPrice ?? item.price ?? 0,
        surplusPrice: item.surplusPrice ?? null,
      }));
      return Response.json(transformedItems, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching menu items:", error.message, error.stack);
    return Response.json(
      { error: error.message || "Failed to fetch menu items" },
      {
        status:
          error.message.includes("Unauthorized") ||
          error.message.includes("not approved")
            ? 403
            : 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      throw new Error("Authorization token missing");
    }

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    const restaurant = await RestaurantProfile.findOne({ userId: uid });
    if (!restaurant) {
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }
    if (restaurant.status !== "approved") {
      return Response.json(
        { error: "Restaurant not approved" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const originalPrice = formData.get("originalPrice");
    const surplusPrice = formData.get("surplusPrice");
    const isSurplus = formData.get("isSurplus") === "true";
    const category = formData.get("category");
    const image = formData.get("image");

    if (!name || !originalPrice || !category) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedOriginalPrice = parseFloat(originalPrice);
    if (isNaN(parsedOriginalPrice) || parsedOriginalPrice < 0) {
      return Response.json(
        { error: "Invalid original price" },
        { status: 400 }
      );
    }

    let parsedSurplusPrice = null;
    if (isSurplus) {
      if (!surplusPrice) {
        return Response.json(
          { error: "Surplus price is required when marking as surplus" },
          { status: 400 }
        );
      }
      parsedSurplusPrice = parseFloat(surplusPrice);
      if (isNaN(parsedSurplusPrice) || parsedSurplusPrice < 0) {
        return Response.json(
          { error: "Invalid surplus price" },
          { status: 400 }
        );
      }
      if (parsedSurplusPrice >= parsedOriginalPrice) {
        return Response.json(
          { error: "Surplus price must be lower than original price" },
          { status: 400 }
        );
      }
    }

    let imageUrl = "";
    if (image && image.size > 0) {
      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const { url } = await uploadImage(buffer, image.name);
        imageUrl = url;
      } catch (uploadError) {
        console.error(
          "Cloudinary upload error:",
          uploadError.message,
          uploadError.stack
        );
        return Response.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    const menuItem = await MenuItem.create({
      restaurant: restaurant._id,
      name,
      description,
      originalPrice: parsedOriginalPrice,
      surplusPrice: parsedSurplusPrice,
      isSurplus,
      category,
      image: imageUrl,
    });

    return Response.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error.message, error.stack);
    return Response.json(
      { error: error.message || "Failed to create menu item" },
      {
        status:
          error.message.includes("Unauthorized") ||
          error.message.includes("not approved")
            ? 403
            : 500,
      }
    );
  }
}

export async function PATCH(req) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      throw new Error("Authorization token missing");
    }

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    const restaurant = await RestaurantProfile.findOne({ userId: uid });
    if (!restaurant) {
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }
    if (restaurant.status !== "approved") {
      return Response.json(
        { error: "Restaurant not approved" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const itemId = formData.get("itemId");
    const name = formData.get("name");
    const description = formData.get("description");
    const originalPrice = formData.get("originalPrice");
    const surplusPrice = formData.get("surplusPrice");
    const isSurplus = formData.get("isSurplus") === "true";
    const category = formData.get("category");
    const image = formData.get("image");

    if (!itemId) {
      return Response.json({ error: "Item ID is required" }, { status: 400 });
    }

    const menuItem = await MenuItem.findOne({
      _id: itemId,
      restaurant: restaurant._id,
    });
    if (!menuItem) {
      return Response.json({ error: "Menu item not found" }, { status: 404 });
    }

    // Track if the item was newly marked as surplus or surplus price changed
    const wasSurplus = menuItem.isSurplus;
    const previousSurplusPrice = menuItem.surplusPrice;

    // Update fields only if provided
    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (originalPrice) {
      const parsedOriginalPrice = parseFloat(originalPrice);
      if (isNaN(parsedOriginalPrice) || parsedOriginalPrice < 0) {
        return Response.json(
          { error: "Invalid original price" },
          { status: 400 }
        );
      }
      menuItem.originalPrice = parsedOriginalPrice;
    }

    // Handle surplusPrice
    if (isSurplus) {
      if (!surplusPrice) {
        return Response.json(
          { error: "Surplus price is required when marking as surplus" },
          { status: 400 }
        );
      }
      const parsedSurplusPrice = parseFloat(surplusPrice);
      if (isNaN(parsedSurplusPrice) || parsedSurplusPrice < 0) {
        return Response.json(
          { error: "Invalid surplus price" },
          { status: 400 }
        );
      }
      if (parsedSurplusPrice >= menuItem.originalPrice) {
        return Response.json(
          { error: "Surplus price must be lower than original price" },
          { status: 400 }
        );
      }
      menuItem.surplusPrice = parsedSurplusPrice;
    } else {
      menuItem.surplusPrice = null; // Clear surplusPrice when not surplus
    }
    menuItem.isSurplus = isSurplus;

    if (category && ["Main", "Side", "Drink", "Dessert"].includes(category)) {
      menuItem.category = category;
    }

    // Handle image update
    let imageUrl = menuItem.image;
    if (image && image.size > 0) {
      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const { url } = await uploadImage(buffer, image.name);
        imageUrl = url;
      } catch (uploadError) {
        console.error(
          "Cloudinary upload error:",
          uploadError.message,
          uploadError.stack
        );
        return Response.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }
    menuItem.image = imageUrl;

    await menuItem.save();

    // Send notification if item is newly marked as surplus or surplus price changed
    if (
      isSurplus &&
      (!wasSurplus || previousSurplusPrice !== parseFloat(surplusPrice))
    ) {
      try {
        // Find users with surplus notifications enabled
        const usersToNotify = await UserNotification.find({
          "preferences.surplus": true,
          "preferences.email": true,
        });

        for (const userNotification of usersToNotify) {
          const notification = {
            type: "surplus",
            title: `New Surplus Item: ${menuItem.name}`,
            message: `A new surplus item "${menuItem.name}" is available at ${
              restaurant.name
            } for ₦${menuItem.surplusPrice.toFixed(
              2
            )} (original price: ₦${menuItem.originalPrice.toFixed(2)}).`,
            isRead: false,
            createdAt: new Date(),
          };

          // Check for duplicates within the last minute
          const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
          const existingNotification = userNotification.notifications.find(
            (n) =>
              n.type === notification.type &&
              n.title === notification.title &&
              n.message === notification.message &&
              n.createdAt > oneMinuteAgo
          );

          if (!existingNotification) {
            // Add notification to user's history
            await UserNotification.findByIdAndUpdate(userNotification._id, {
              $push: { notifications: notification },
            });

            // Send email
            try {
              const userRecord = await admin
                .auth()
                .getUser(userNotification.userId);
              const modernEmailTemplate = `
          <!DOCTYPE html>
          <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>${notification.title}</title>
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
                      ${notification.title}
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
                      ${notification.message}
                    </p>
                  </div>

                  ${
                    notification.type === "surplus"
                      ? `
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
                      <div style="font-size: 32px; margin-bottom: 10px;">🌱</div>
                      <p style="color: #065f46; margin: 0; font-size: 14px; font-weight: 600;">
                        Help reduce food waste while saving money!
                      </p>
                    </div>
                  `
                      : notification.type === "discounts"
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
                  <a href="https://yumcycle.vercel.app" style="display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 20px rgba(249, 115, 22, 0.3); transition: all 0.3s ease; letter-spacing: 0.25px;">
                    Open YumCycle App
                  </a>
                  <p style="margin: 20px 0 0 0; font-size: 14px; color: #6b7280;">
                    Or visit our website at <a href="https://yumcycle.vercel.app" style="color: #f97316; text-decoration: none; font-weight: 600;">yumcycle.com</a>
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
                    You received this email because you have enabled <strong>${
                      notification.type
                    }</strong> notifications.
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
              if (userRecord.email) {
                await sendEmail({
                  to: userRecord.email,
                  subject: notification.title,
                  text: notification.message,
                  html: modernEmailTemplate,
                });
                console.log(
                  `Email sent to ${userRecord.email} for surplus item ${menuItem.name}`
                );
              }
            } catch (emailError) {
              console.error(
                `Failed to send email to user ${userNotification.userId}:`,
                emailError
              );
            }
          }
        }
      } catch (notificationError) {
        console.error(
          "Error sending surplus notifications:",
          notificationError
        );
        // Don't fail the request if notifications fail
      }
    }

    return Response.json(menuItem, { status: 200 });
  } catch (error) {
    console.error("Error updating menu item:", error.message, error.stack);
    return Response.json(
      { error: error.message || "Failed to update menu item" },
      {
        status:
          error.message.includes("Unauthorized") ||
          error.message.includes("not approved")
            ? 403
            : error.message.includes("not found")
            ? 404
            : 400,
      }
    );
  }
}

export async function DELETE(req) {
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      throw new Error("Authorization token missing");
    }

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    const restaurant = await RestaurantProfile.findOne({ userId: uid });
    if (!restaurant) {
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }
    if (restaurant.status !== "approved") {
      return Response.json(
        { error: "Restaurant not approved" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return Response.json({ error: "Item ID is required" }, { status: 400 });
    }

    const menuItem = await MenuItem.findOne({
      _id: itemId,
      restaurant: restaurant._id,
    });
    if (!menuItem) {
      return Response.json({ error: "Menu item not found" }, { status: 404 });
    }

    await MenuItem.deleteOne({ _id: itemId });

    return Response.json(
      { message: "Menu item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting menu item:", error.message, error.stack);
    return Response.json(
      { error: error.message || "Failed to delete menu item" },
      {
        status:
          error.message.includes("Unauthorized") ||
          error.message.includes("not approved")
            ? 403
            : error.message.includes("not found")
            ? 404
            : 400,
      }
    );
  }
}
