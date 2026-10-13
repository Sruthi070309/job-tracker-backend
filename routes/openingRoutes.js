import express from "express";
import { getOpenings, createOpening, updateOpening, deleteOpening } from "../controllers/openingController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getOpenings); // public: anyone can browse openings
router.post("/", protect, restrictTo("admin"), createOpening);
router.route("/:id").put(protect, restrictTo("admin"), updateOpening).delete(protect, restrictTo("admin"), deleteOpening);

export default router;
