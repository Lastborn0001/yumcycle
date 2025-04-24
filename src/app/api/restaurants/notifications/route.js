import { connectToDatabase } from "@/libs/db/mongo";
import Notification from "@/models/Notification";
import admin from "@/libs/firebaseAdmin";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

async function getAuthenticatedUser(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) throw new Error("Authorization token missing");
    const decoded = await admin.auth().verifyIdToken(token);
    // console.log("Authenticated user:", decoded);
    return decoded;
  } catch (error) {
    console.error("getAuthenticatedUser error:", error);
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing token" },
      { status: 401 }
    );
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const decoded = await getAuthenticatedUser(req);
    if (decoded instanceof NextResponse) return decoded; // Handle unauthorized

    // Find restaurant by userId
    const restaurant = await mongoose.models.RestaurantProfile.findOne({
      userId: decoded.uid,
    });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found for this user" },
        { status: 404 }
      );
    }

    const notifications = await Notification.find({
      restaurantId: restaurant._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    // console.log(
    //   `Fetched ${notifications.length} notifications for restaurant ${restaurant._id}`
    // );

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET /api/restaurants/notifications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const decoded = await getAuthenticatedUser(req);
    if (decoded instanceof NextResponse) return decoded; // Handle unauthorized

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Notification ID required" },
        { status: 400 }
      );
    }

    const restaurant = await mongoose.models.RestaurantProfile.findOne({
      userId: decoded.uid,
    });
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const notification = await Notification.findOne({
      _id: id,
      restaurantId: restaurant._id,
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found or unauthorized" },
        { status: 404 }
      );
    }

    notification.read = true;
    await notification.save();

    // console.log(
    //   `Notification ${id} marked as read for restaurant ${restaurant._id}`
    // );

    return NextResponse.json(notification);
  } catch (error) {
    console.error("PUT /api/restaurants/notifications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}
