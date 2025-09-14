import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { connectToDatabase } from "@/libs/db/mongo";
import RestaurantProfile from '@/models/RestaurantProfile';
import User from '@/models/User';

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Verify admin role
const verifyAdmin = async (token) => {
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    await connectToDatabase();
    
    const user = await User.findOne({ uid: decodedToken.uid });
    if (!user || user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }
    
    return user;
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    await verifyAdmin(token);

    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch restaurants with user data populated
    const restaurants = await RestaurantProfile.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'uid',
          as: 'userDetails'
        }
      },
      {
        $addFields: {
          userId: { $arrayElemAt: ['$userDetails', 0] }
        }
      },
      {
        $project: {
          userDetails: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    // Verify admin
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) throw new Error("Authorization token missing");
    await verifyAdmin(token);

    const { action, restaurantId, userId } = await req.json();

    if (!action || !restaurantId || !userId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    if (action === "approve") {
      // Update RestaurantProfile status to "approved" and User role to "restaurant"
      const [restaurant, user] = await Promise.all([
        RestaurantProfile.findByIdAndUpdate(
          restaurantId,
          { status: "approved" },
          { new: true }
        ),
        User.findOneAndUpdate(
          { uid: userId },
          { role: "restaurant" }, // Change role to restaurant when approved
          { new: true }
        ),
      ]);

      if (!restaurant) {
        return Response.json(
          { error: "Restaurant not found" },
          { status: 404 }
        );
      }

      return Response.json({ success: true, message: "Restaurant approved successfully" }, { status: 200 });
      
    } else if (action === "reject") {
      // Update RestaurantProfile status to "rejected"
      const restaurant = await RestaurantProfile.findByIdAndUpdate(
        restaurantId,
        { status: "rejected" },
        { new: true }
      );

      if (!restaurant) {
        return Response.json(
          { error: "Restaurant not found" },
          { status: 404 }
        );
      }

      return Response.json({ success: true, message: "Restaurant rejected successfully" }, { status: 200 });
      
    } else if (action === "delete") {
      // Delete RestaurantProfile and optionally reset user role
      const [restaurant] = await Promise.all([
        RestaurantProfile.findByIdAndDelete(restaurantId),
        User.findOneAndUpdate(
          { uid: userId },
          { role: "user" }, // Reset role back to user
          { new: true }
        ),
      ]);

      if (!restaurant) {
        return Response.json(
          { error: "Restaurant not found" },
          { status: 404 }
        );
      }

      return Response.json({ success: true, message: "Restaurant deleted successfully" }, { status: 200 });
      
    } else {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json(
      { error: error.message || "Failed to process request" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}