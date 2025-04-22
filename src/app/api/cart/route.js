import { connectToDatabase } from "@/libs/db/mongo";
import Cart from "@/models/Cart";
import admin from "@/libs/firebaseAdmin";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

async function getAuthenticatedUser(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) throw new Error("Authorization token missing");
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("Authenticated user:", decoded);
    return decoded;
  } catch (error) {
    console.error("getAuthenticatedUser error:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const decoded = await getAuthenticatedUser(req);
    const { item } = await req.json();

    if (!item?._id || !item?.name || typeof item?.price !== "number") {
      return NextResponse.json(
        { error: "Item must have _id, name, and price" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userUid: decoded.uid });

    if (!cart) {
      cart = new Cart({ userUid: decoded.uid, items: [] });
    }

    const existingIndex = cart.items.findIndex((i) => i._id === item._id);

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += 1;
    } else {
      cart.items.push({
        _id: item._id,
        name: item.name,
        price: item.price,
        restaurantId: item.restaurantId || item.restaurant,
        restaurantName: item.restaurantName,
        image: item.image || "",
        category: item.category || "general",
        description: item.description || "",
        quantity: 1,
      });
    }

    const result = await cart.save();
    console.log("Cart save result:", result);

    return NextResponse.json({ success: true, cart: cart.items });
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add to cart" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const decoded = await getAuthenticatedUser(req);

    const cart = await Cart.findOne({ userUid: decoded.uid });
    console.log("Fetched cart:", cart);

    return NextResponse.json({ cart: cart?.items || [] });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch cart" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await connectToDatabase();
    const decoded = await getAuthenticatedUser(req);
    const { itemId, action } = await req.json();

    const cart = await Cart.findOne({ userUid: decoded.uid });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex((item) => item._id === itemId);
    if (itemIndex === -1) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }

    if (action === "increment") {
      cart.items[itemIndex].quantity += 1;
    } else if (action === "decrement") {
      cart.items[itemIndex].quantity -= 1;
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }
    } else if (action === "remove") {
      cart.items.splice(itemIndex, 1);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const result = await cart.save();
    console.log("Cart update result:", result);

    return NextResponse.json({ success: true, cart: cart.items });
  } catch (error) {
    console.error("PATCH /api/cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cart" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const decoded = await getAuthenticatedUser(req);

    const cart = await Cart.findOne({ userUid: decoded.uid });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    cart.items = [];
    const result = await cart.save();
    console.log("Cart clear result:", result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to clear cart" },
      { status: error.message.includes("Unauthorized") ? 401 : 500 }
    );
  }
}
