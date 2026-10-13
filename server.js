import "dotenv/config";
import dns from "node:dns";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import openingRoutes from "./routes/openingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]); // fixes the querySrv ECONNREFUSED error

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Add it to your .env file.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: only these websites may call the API from a browser.
// Set CORS_ORIGINS in .env (comma separated), e.g. https://sruthi070309.github.io
// Outside production, localhost and 127.0.0.1 (VS Code Live Server) are also allowed.
const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
const localDev = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      const ok =
        !origin || // Postman and server-to-server calls send no Origin
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" && localDev.test(origin));
      callback(ok ? null : new Error("Not allowed by CORS"), ok);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => res.json({ message: "JobTrack API is running" }));
app.use("/api/auth", authRoutes);
app.use("/api/openings", openingRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Last stop for errors
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") return res.status(403).json({ message: "Origin not allowed" });
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON body" });
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
