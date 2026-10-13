import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const { ADMIN_NAME = "Admin", ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Add ADMIN_EMAIL and ADMIN_PASSWORD to your .env file first.");
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 8) {
  console.error("ADMIN_PASSWORD must be at least 8 characters.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI);
  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin"; // keeps the existing password
    await existing.save();
    console.log("Existing account promoted to admin: " + email);
  } else {
    await User.create({ name: ADMIN_NAME, email, password: await bcrypt.hash(ADMIN_PASSWORD, 10), role: "admin" });
    console.log("Admin account created: " + email);
  }
} catch (error) {
  console.error("Could not create admin:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
