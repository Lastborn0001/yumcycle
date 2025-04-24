require("dotenv").config({ path: ".env.local" });
// console.log("MONGO_URI:", process.env.MONGO_URI);

const admin = require("./src/libs/firebaseAdmin");
const { connectToDatabase } = require("./src/libs/db/mongo");
const User = require("./src/models/User");

async function createAdminUser() {
  try {
    await connectToDatabase();

    // Create user in Firebase
    const firebaseUser = await admin.auth().createUser({
      email: "admin@yumcycle.food",
      password: "yumcycle@2025",
      displayName: "Admin",
    });
    // console.log("Firebase user created:", firebaseUser.uid);

    // Save user in MongoDB
    const userData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      role: "admin",
    };

    const user = await User.findOneAndUpdate({ uid: userData.uid }, userData, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
    // console.log("MongoDB user created:", user);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
