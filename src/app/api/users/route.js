import { connectToDatabase } from "@/libs/db/mongo";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";

async function verifyUser(token) {
  // console.log("Verifying token:", token?.slice(0, 20) + "...");
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email };
  } catch (error) {
    console.error("Verification error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(error.message || "Invalid or expired token");
  }
}

export async function POST(req) {
  // console.log("Handling POST /api/users");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      // console.log("No token provided");
      return Response.json(
        { error: "Authorization token missing" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { uid, email } = await verifyUser(token);

    const firebaseUser = await admin.auth().getUser(uid);
    // console.log("Firebase user:", {
    //   uid,
    //   email,
    //   name: firebaseUser.displayName,
    //   photoURL: firebaseUser.photoURL || "No photoURL provided",
    // });

    let user = await User.findOne({ uid });
    if (!user) {
      // console.log("Creating new user in MongoDB");
      user = await User.create({
        uid,
        email: email || firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: "user",
      });
    } else {
      // console.log("Updating existing user in MongoDB");
      user = await User.findOneAndUpdate(
        { uid },
        {
          $set: {
            email: email || firebaseUser.email,
            name: firebaseUser.displayName || user.name,
            photoURL: firebaseUser.photoURL || user.photoURL,
          },
        },
        { new: true }
      );
    }

    // console.log("User processed:", user._id);
    return Response.json(user, { status: 201 });
  } catch (error) {
    console.error("Error processing user:", {
      message: error.message,
      stack: error.stack,
    });
    return Response.json(
      { error: error.message || "Failed to process user" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
