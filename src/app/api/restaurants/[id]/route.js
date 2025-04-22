import { connectToDatabase } from "@/libs/db/mongo";
import RestaurantProfile from "@/models/RestaurantProfile";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  // console.log(`Handling GET /api/restaurants/${params.id}`);
  try {
    await connectToDatabase();

    // Await params to access id
    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(id)) {
      console.log("Invalid restaurant ID:", id);
      return Response.json({ error: "Invalid restaurant ID" }, { status: 400 });
    }

    const restaurant = await RestaurantProfile.findOne({
      _id: id,
      status: "approved",
    }).lean();

    if (!restaurant) {
      console.log("Restaurant not found or not approved:", id);
      return Response.json({ error: "Restaurant not found" }, { status: 404 });
    }

    console.log("Restaurant found:", restaurant._id);
    return Response.json(restaurant, { status: 200 });
  } catch (error) {
    console.error("Error fetching restaurant:", {
      message: error.message,
      stack: error.stack,
    });
    return Response.json(
      { error: "Failed to fetch restaurant" },
      { status: 500 }
    );
  }
}
