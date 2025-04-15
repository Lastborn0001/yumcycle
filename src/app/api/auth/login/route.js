import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { admin } from "@/libs/firebaseAdmin";
import connectMongo from "@/libs/db/mongo";
import User from "@/models/User";
import { initializeApp } from "firebase/app";

// Initialize Firebase Client SDK (for email/password login)
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

    // Case 1: Email/Password Login
    if (email && password) {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      firebaseUser = userCredential.user;
      userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || email.split("@")[0], // Use displayName or email prefix
      };
    }
    // Case 2: Google Auth
    else if (token) {
      const decoded = await admin.auth().verifyIdToken(token);
      firebaseUser = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
      };
      userData = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
      };
    } else {
      return Response.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // Prevent duplicates by using uid as unique identifier
    await connectMongo();
    const user = await User.findOneAndUpdate(
      { uid: userData.uid }, // Search by uid only
      userData,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return Response.json(user, { status: 200 });
  } catch (err) {
    console.error("Login error:", err);
    return Response.json(
      { error: err.message || "Login failed" },
      { status: 401 }
    );
  }
}
