import { connectToDatabase } from "@/libs/db/mongo";
import User from "@/models/User";
import admin from "@/libs/firebaseAdmin";
import { uploadImage } from "@/libs/utils/cloudinary";

async function verifyUser(token) {
  console.log("Verifying token for user profile:", token?.slice(0, 20) + "...");
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ uid: decoded.uid });
    console.log("User found:", user ? user.uid : "none");
    if (!user) {
      throw new Error("User not found");
    }
    return { user, uid: decoded.uid };
  } catch (error) {
    console.error("Verification error:", {
      message: error.message,
      stack: error.stack,
    });
    throw new Error(error.message || "Invalid or expired token");
  }
}

export async function GET(req) {
  console.log("Handling GET /api/users/profile");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      console.log("No token provided");
      return Response.json(
        { error: "Authorization token missing" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { user } = await verifyUser(token);
    console.log(token);
    console.log("Profile fetched:", user._id);
    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", {
      message: error.message,
      stack: error.stack,
    });
    return Response.json(
      { error: error.message || "Failed to fetch profile" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}

export async function PATCH(req) {
  console.log("Handling PATCH /api/users/profile");
  try {
    const token = req.headers.get("authorization")?.split("Bearer ")[1];
    if (!token) {
      console.log("No token provided");
      return Response.json(
        { error: "Authorization token missing" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { uid } = await verifyUser(token);

    console.log("Parsing FormData");
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const image = formData.get("image");
    const removeImage = formData.get("removeImage") === "true";

    console.log("FormData values:", {
      name,
      email,
      image: image
        ? { name: image.name, size: image.size, type: image.type }
        : "none",
      removeImage,
    });

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    if (removeImage) {
      updates.photoURL = "";
      console.log("Removing profile picture");
      await admin.auth().updateUser(uid, { photoURL: null });
      console.log("Firebase photoURL cleared");
    } else if (image && image.size > 0) {
      console.log("Uploading image to Cloudinary:", image.name);
      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const { url } = await uploadImage(buffer, `user_${uid}_${image.name}`);
        updates.photoURL = url;
        console.log("Image uploaded successfully:", url);
        await admin.auth().updateUser(uid, { photoURL: url });
        console.log("Firebase photoURL updated");
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return Response.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }
    }

    console.log("Updating user profile in MongoDB");
    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { $set: updates },
      { new: true }
    ).lean();

    if (!updatedUser) {
      console.log("User not found for uid:", uid);
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Profile updated:", updatedUser._id);
    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", {
      message: error.message,
      stack: error.stack,
    });
    return Response.json(
      { error: error.message || "Failed to update profile" },
      { status: error.message.includes("Unauthorized") ? 403 : 500 }
    );
  }
}
