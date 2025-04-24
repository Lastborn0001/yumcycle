import { connectToDatabase } from "@/libs/db/mongo";
import RestaurantProfile from "@/models/RestaurantProfile";
import MenuItem from "@/models/MenuItem";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";
import { uploadImage } from "@/libs/utils/cloudinary";

async function verifyRestaurantOwner(token) {
  // console.log("Verifying token for menu:", token?.slice(0, 20) + "...");
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decoded.uid });
    // console.log("User found:", user ? user.uid : "none");
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
  // console.log("Handling GET /api/restaurants/menu");
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (restaurantId) {
      // Public access for users
      const restaurant = await RestaurantProfile.findOne({
        _id: restaurantId,
        status: "approved",
      });
      if (!restaurant) {
        // console.log("Restaurant not found or not approved:", restaurantId);
        return Response.json(
          { error: "Restaurant not found or not approved" },
          { status: 404 }
        );
      }
      const menuItems = await MenuItem.find({
        restaurant: restaurantId,
      }).lean();
      // console.log("Menu items found for restaurant:", menuItems.length);
      return Response.json(menuItems, { status: 200 });
    }

    // Authenticated access for restaurant owners
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      // console.log("No token provided");
      return Response.json(
        { error: "Authorization token missing" },
        { status: 401 }
      );
    }

    const { uid } = await verifyRestaurantOwner(token);
    const restaurant = await RestaurantProfile.findOne({ userId: uid });
    // console.log("Restaurant found:", restaurant ? restaurant._id : "none");
    if (!restaurant) {
      // console.log("Restaurant not found for uid:", uid);
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }
    if (restaurant.status !== "approved") {
      // console.log("Restaurant not approved:", restaurant.status);
      return Response.json(
        { error: "Restaurant not approved" },
        { status: 403 }
      );
    }

    // console.log("Querying menu items for restaurant:", restaurant._id);
    const menuItems = await MenuItem.find({
      restaurant: restaurant._id,
    }).lean();
    // console.log("Menu items found:", menuItems.length);

    return Response.json(menuItems, { status: 200 });
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
  // console.log("Handling POST /api/restaurants/menu");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      // console.log("No token provided");
      throw new Error("Authorization token missing");
    }

    await connectToDatabase();
    const { uid } = await verifyRestaurantOwner(token);

    const restaurant = await RestaurantProfile.findOne({ userId: uid });
    // console.log("Restaurant found:", restaurant ? restaurant._id : "none");
    if (!restaurant) {
      // console.log("Restaurant not found for uid:", uid);
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }
    if (restaurant.status !== "approved") {
      // console.log("Restaurant not approved:", restaurant.status);
      return Response.json(
        { error: "Restaurant not approved" },
        { status: 403 }
      );
    }

    // console.log("Parsing FormData");
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const image = formData.get("image");

    // console.log("FormData values:", {
    //   name,
    //   description,
    //   price,
    //   category,
    //   image: image ? image.name : "none",
    // });

    if (!name || !price || !category) {
      // console.log("Missing required fields:", { name, price, category });
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      // console.log("Invalid price:", price);
      return Response.json({ error: "Invalid price" }, { status: 400 });
    }

    let imageUrl = "";
    if (image && image.size > 0) {
      // console.log("Uploading image to Cloudinary:", image.name);
      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const { url } = await uploadImage(buffer, image.name);
        imageUrl = url;
        // console.log("Image uploaded successfully:", imageUrl);
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

    // console.log("Creating menu item in MongoDB");
    const menuItem = await MenuItem.create({
      restaurant: restaurant._id,
      name,
      description,
      price: parsedPrice,
      category,
      image: imageUrl,
    });

    // console.log("Menu item created:", menuItem._id);
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
