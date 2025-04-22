import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import admin from "@/libs/firebaseAdmin";
import User from "@/models/User";
import RestaurantProfile from "@/models/RestaurantProfile";
import { initializeApp } from "firebase/app";
import { connectToDatabase } from "@/libs/db/mongo";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function POST(request) {
  let firebaseUser = null;

  try {
    const { email, password, name, role, restaurantData } =
      await request.json();

    // Input validation
    if (!email || !password || !name || !role) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["user", "restaurant", "admin"].includes(role)) {
      return Response.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check MongoDB first
    await connectToDatabase();
    if (await User.findOne({ email })) {
      return Response.json({ error: "Email already in use" }, { status: 409 });
    }

    // Create Firebase user
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      firebaseUser = userCredential.user;
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        return Response.json(
          { error: "Email already in use" },
          { status: 409 }
        );
      }
      throw error;
    }

    // Set custom claims and profile
    await Promise.all([
      admin.auth().setCustomUserClaims(firebaseUser.uid, { role }),
      updateProfile(firebaseUser, { displayName: name }),
    ]);

    // Create user document with explicit cart
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name,
      role,
      status: role === "restaurant" ? "pending" : "approved",
      cart: [], // Explicitly set cart
    };

    if (role === "restaurant") {
      const restaurantProfile = await RestaurantProfile.create({
        userId: firebaseUser.uid,
        ...restaurantData,
        status: "pending",
      });
      userData.restaurantId = restaurantProfile._id;
    }

    // Try Mongoose create
    let user;
    try {
      user = await User.create(userData);
      console.log("Created user (Mongoose):", user);
    } catch (mongooseError) {
      console.error("Mongoose create error:", mongooseError);
      // Fallback to raw insert
      user = await User.collection.insertOne(userData);
      console.log("Created user (raw insert):", user);
    }

    // Verify raw database state
    const rawUser = await User.collection.findOne({ uid: firebaseUser.uid });
    console.log("Created user (raw):", rawUser);

    return Response.json(
      {
        success: true,
        user,
        ...(role === "restaurant" && { restaurant: userData.restaurantId }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    // Cleanup Firebase user if creation failed
    if (firebaseUser?.uid) {
      try {
        await admin.auth().deleteUser(firebaseUser.uid);
      } catch (deleteError) {
        console.error("Cleanup error:", deleteError);
      }
    }

    return Response.json(
      {
        error: error.message || "Registration failed",
        ...(process.env.NODE_ENV === "development" && { details: error.stack }),
      },
      { status: 400 }
    );
  }
}
