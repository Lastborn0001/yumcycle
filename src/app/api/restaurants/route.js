import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Restaurant from "@/models/Restaurant";
import { connectToDatabase } from "@/libs/db/mongo";

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch single restaurant by ID
      const restaurant = await Restaurant.findById(id).lean();
      if (!restaurant) {
        return NextResponse.json(
          { error: "Restaurant not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        ...restaurant,
        id: restaurant._id.toString(),
        _id: undefined,
      });
    } else {
      // Fetch all restaurants
      const restaurants = await Restaurant.find().lean();
      const formattedRestaurants = restaurants.map((restaurant) => ({
        ...restaurant,
        id: restaurant._id.toString(),
        _id: undefined,
      }));
      return NextResponse.json(formattedRestaurants);
    }
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    let savedRestaurants;
    if (Array.isArray(body)) {
      savedRestaurants = await Restaurant.insertMany(body);
    } else {
      const restaurant = new Restaurant(body);
      savedRestaurants = [await restaurant.save()];
    }

    const response = savedRestaurants.map((restaurant) => ({
      ...restaurant.toObject(),
      id: restaurant._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json(Array.isArray(body) ? response : response[0], {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create restaurant" },
      { status: 500 }
    );
  }
}
