// scripts/migrate-users-cart.js
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String },
  photoURL: { type: String },
  role: {
    type: String,
    enum: ["user", "restaurant", "admin"],
    default: "user",
  },
  cart: { type: Array, default: [] },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const users = await User.find({ cart: { $exists: false } });
    console.log(`Found ${users.length} users without cart field`);

    for (const user of users) {
      user.cart = [];
      await user.save();
      console.log(`Updated user ${user.uid}`);
    }

    console.log("Migration complete");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

migrateUsers();
