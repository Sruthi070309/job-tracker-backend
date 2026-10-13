import express from "express";
import { getStats } from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, restrictTo("admin")); // everything under /api/admin is admin only

router.get("/stats", getStats);

export default router;
