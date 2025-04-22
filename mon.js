require("dotenv").config({ path: ".env.local" });
console.log("MONGO_URI:", process.env.MONGO_URI);
