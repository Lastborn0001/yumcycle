import { connectToDatabase } from "@/libs/db/mongo";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";

async function verifyUserFromToken(req) {
  const token = req.headers.get("authorization")?.split("Bearer ")[1];
  if (!token) {
    throw new Error("Authorization token missing");
  }
  try {
    await connectToDatabase();
    const decoded = await admin.auth().verifyIdToken(token);
    let user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      user = new User({
        uid: decoded.uid,
        email: decoded.email || "unknown@example.com",
        name: decoded.name || "",
        photoURL: decoded.picture || "",
        role: "user",
        cart: [],
      });
      await user.save();
      //   console.log("Created new user:", user.uid);
    } else if (!user.cart) {
      user.cart = [];
      await user.save();
      //   console.log("Initialized cart for existing user:", user.uid);
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

export async function POST(req) {
  //   console.log("Handling POST /api/cart/merge");
  try {
    const { user } = await verifyUserFromToken(req);
    const { localCart } = await req.json();

    if (!Array.isArray(localCart)) {
      throw new Error("Invalid local cart data");
    }

    const mergedCart = [...user.cart];
    let modified = false;

    for (const localItem of localCart) {
      if (!localItem._id || !localItem.name || !localItem.price) {
        console.warn("Skipping invalid local item:", localItem);
        continue;
      }
      const existingItem = mergedCart.find((i) => i._id === localItem._id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + (localItem.quantity || 1);
        if (newQuantity !== existingItem.quantity) {
          existingItem.quantity = newQuantity;
          modified = true;
        }
      } else {
        mergedCart.push({ ...localItem, quantity: localItem.quantity || 1 });
        modified = true;
      }
    }

    if (modified) {
      user.cart = mergedCart;
      await user.save();
      //   console.log("Cart merged for user:", user.uid);
    } else {
      //   console.log("No changes in cart for user:", user.uid);
    }

    return Response.json({ cart: user.cart, modified }, { status: 200 });
  } catch (error) {
    console.error("Error merging cart:", {
      message: error.message,
      stack: error.stack,
    });
    return Response.json(
      { error: error.message || "Failed to merge cart" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
