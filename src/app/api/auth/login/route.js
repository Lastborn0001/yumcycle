import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import admin from "@/libs/firebaseAdmin";
import { connectToDatabase } from "@/libs/db/mongo";
import User from "@/models/User";
import { initializeApp } from "firebase/app";

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

export async function POST(req) {
  const { email, password, token } = await req.json();

  try {
    let firebaseUser;
    let userData = {};

    // Email/Password Login
    if (email && password) {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      firebaseUser = userCredential.user;

      // Get custom claims
      const tokenResult = await firebaseUser.getIdTokenResult();
      const role = tokenResult.claims.role || "user"; // Fallback to "user"

      userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        role, // Include role from custom claims
      };
    }
    // Google Auth
    else if (token) {
      const decoded = await admin.auth().verifyIdToken(token);
      const role = decoded.role || "user"; // Fallback to "user"
      firebaseUser = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
      };
      userData = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        role,
      };
    } else {
      return Response.json({ error: "Invalid credentials" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOneAndUpdate(
      { uid: userData.uid },
      { ...userData, role: userData.role }, // Ensure role is updated
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).populate("restaurantId");

    // Check if restaurant account is approved
    if (user.role === "restaurant" && user.status !== "approved") {
      return Response.json(
        { error: "Your restaurant account is pending approval" },
        { status: 403 }
      );
    }

    return Response.json(
      { ...user.toObject(), role: userData.role },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return Response.json(
      { error: err.message || "Login failed" },
      { status: 401 }
    );
  }
}
