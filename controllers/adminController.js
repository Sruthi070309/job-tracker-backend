import User from "../models/User.js";
import Opening from "../models/Opening.js";
import Job from "../models/Job.js";

// GET /api/admin/stats   (admin only) - numbers for the dashboard cards
export const getStats = async (req, res) => {
  try {
    const [internships, jobs, users, applications] = await Promise.all([
      Opening.countDocuments({ type: "Internship" }),
      Opening.countDocuments({ type: "Job" }),
      User.countDocuments(),
      Job.countDocuments(),
    ]);
    res.status(200).json({ internships, jobs, users, applications });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
