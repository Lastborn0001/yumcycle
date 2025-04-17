import { NextResponse } from "next/server";
import mongoose from "mongoose";
import MenuItem from "@/models/MenuItem";
import { connectToDatabase } from "@/libs/db/mongo";

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Restaurant ID is required" },
        { status: 400 }
      );
    }

    const menuItems = await MenuItem.find({ restaurant: restaurantId }).lean();
    const formattedMenuItems = menuItems.map((item) => ({
      ...item,
      id: item._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(formattedMenuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    let savedMenuItems;
    if (Array.isArray(body)) {
      savedMenuItems = await MenuItem.insertMany(body);
    } else {
      const menuItem = new MenuItem(body);
      savedMenuItems = [await menuItem.save()];
    }

    const response = savedMenuItems.map((item) => ({
      ...item.toObject(),
      id: item._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(Array.isArray(body) ? response : response[0], {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}
