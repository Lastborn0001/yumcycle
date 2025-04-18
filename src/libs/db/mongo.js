require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

let isConnected = false;
async function connectToDatabase() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = { connectToDatabase };
