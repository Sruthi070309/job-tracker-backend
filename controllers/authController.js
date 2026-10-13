import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Used so a wrong email takes about as long as a wrong password (no user-guessing by timing)
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });
const serverError = (res, error) => res.status(500).json({ message: "Server error", error: error.message });
const allStrings = (...values) => values.every((v) => typeof v === "string");

// POST /api/auth/register  (always creates a normal "user"; the role is never taken from the request)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }
    if (!allStrings(name, email, password)) {
      return res.status(400).json({ message: "name, email and password must be text" });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ message: "Account created", token: makeToken(user), user: publicUser(user) });
  } catch (error) {
    serverError(res, error);
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    if (!allStrings(email, password)) {
      return res.status(400).json({ message: "email and password must be text" });
    }
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    const passwordOk = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
    if (!user || !passwordOk) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful", token: makeToken(user), user: publicUser(user) });
  } catch (error) {
    serverError(res, error);
  }
};

// GET /api/auth/me  (who am I? used by the frontend to check a saved login)
export const me = (req, res) => res.status(200).json({ user: req.user });
