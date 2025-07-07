import { connectToDatabase } from "@/libs/db/mongo";
import RestaurantProfile from "@/models/RestaurantProfile";
import MenuItem from "@/models/MenuItem";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";
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
