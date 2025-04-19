import { connectToDatabase } from "@/libs/db/mongo";
import RestaurantProfile from "@/models/RestaurantProfile";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";
import { uploadImage } from "@/libs/utils/cloudinary";

async function verifyRestaurantOwner(token) {
  console.log("Verifying token for profile:", token?.slice(0, 20) + "...");
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decoded.uid });
    console.log("User found:", user ? user.uid : "none");
    if (!user || user.role !== "restaurant") {
      throw new Error("Unauthorized: Restaurant owner access required");
    }
    return { user, uid: decoded.uid };
  } catch (error) {
    console.error("Verification error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(error.message || "Invalid or expired token");
  }
}

export async function GET(req) {
  console.log("Handling GET /api/restaurants/profile");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      console.log("No token provided");
      return Response.json(
        { error: "Authorization token missing" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    const restaurant = await RestaurantProfile.findOne({ userId: uid }).lean();
    console.log("Restaurant found:", restaurant ? restaurant._id : "none");
    if (!restaurant) {
      console.log("Restaurant not found for uid:", uid);
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }

    console.log("Profile fetched:", restaurant._id);
    return Response.json(restaurant, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", {
      message: error.message,
      stack: error.stack,
    });
    return Response.json(
      { error: error.message || "Failed to fetch profile" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function PATCH(req) {
  console.log("Handling PATCH /api/restaurants/profile");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      console.log("No token provided");
      return Response.json(
        { error: "Authorization token missing" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    const restaurant = await RestaurantProfile.findOne({ userId: uid });
    console.log("Restaurant found:", restaurant ? restaurant._id : "none");
    if (!restaurant) {
      console.log("Restaurant not found for uid:", uid);
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }
    if (restaurant.status !== "approved") {
      console.log("Restaurant not approved:", restaurant.status);
      return Response.json(
        { error: "Restaurant not approved" },
        { status: 403 }
      );
    }

    console.log("Parsing FormData");
    const formData = await req.formData();
    const image = formData.get("image");
    const isEcoFriendly = formData.get("isEcoFriendly") === "true";

    console.log("FormData values:", {
      image: image
        ? { name: image.name, size: image.size, type: image.type }
        : "none",
      isEcoFriendly,
    });

    const updates = { isEcoFriendly };

    if (image && image.size > 0) {
      console.log("Uploading image to Cloudinary:", image.name);
      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const { url } = await uploadImage(buffer, image.name);
        updates.image = url;
        console.log("Image uploaded successfully:", url);
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

    console.log("Updating restaurant profile in MongoDB");
    const updatedRestaurant = await RestaurantProfile.findOneAndUpdate(
      { _id: restaurant._id },
      { $set: updates },
      { new: true }
    ).lean();

    console.log("Profile updated:", updatedRestaurant._id);
    return Response.json(updatedRestaurant, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", {
      message: error.message,
      stack: error.stack,
    });
    return Response.json(
      { error: error.message || "Failed to update profile" },
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
