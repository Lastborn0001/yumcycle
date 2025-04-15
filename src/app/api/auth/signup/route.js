import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import connectMongo from "@/libs/db/mongo";
import User from "@/models/User";

// Initialize Firebase (same config as client-side)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Use the initialized app

export async function POST(req) {
  const { email, password, name } = await req.json();

  try {
    // Create user in Firebase Auth
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Save to MongoDB
    await connectMongo();
    const newUser = await User.create({
      uid: firebaseUser.uid,
      email,
      name,
      provider: "email",
    });

    return Response.json(newUser, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: err.message || "Signup failed" },
      { status: 400 }
    );
  }
}
