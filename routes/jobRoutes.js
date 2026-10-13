import express from "express";
import { createJob, getJobs, getJobById, updateJob, deleteJob } from "../controllers/jobController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // every job route needs a login token

router.route("/").get(getJobs).post(createJob);
router.route("/:id").get(getJobById).put(updateJob).delete(deleteJob);

export default router;
