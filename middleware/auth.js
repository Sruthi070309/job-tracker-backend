import jwt from "jsonwebtoken";
import User from "../models/User.js";

// AUTHENTICATION: who are you? Checks the token and loads the user from the database.
export const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    // The role is read from the database, so a changed role or a deleted user takes effect immediately.
    const user = await User.findById(decoded.id).select("name email role");
    if (!user) return res.status(401).json({ message: "User no longer exists" });
    req.user = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// AUTHORISATION (RBAC): are you allowed to do this? Use after protect.
export const restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission to do this" });
  }
  next();
};
