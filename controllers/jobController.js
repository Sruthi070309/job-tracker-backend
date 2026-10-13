import mongoose from "mongoose";
import Job from "../models/Job.js";

// Only these fields can be set from the request
const fields = ["company", "role", "location", "status", "applicationDate"];
const pick = (body) =>
  Object.fromEntries(fields.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

const handleError = (res, error) => {
  if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
  return res.status(500).json({ message: "Server error", error: error.message });
};

const invalidId = (id, res) => {
  if (mongoose.isValidObjectId(id)) return false;
  res.status(400).json({ message: "Invalid job id" });
  return true;
};

// CREATE - POST /api/jobs
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...pick(req.body), user: req.user.id });
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    handleError(res, error);
  }
};

// READ ALL - GET /api/jobs (only the logged-in user's applications)
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id }).sort({ applicationDate: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    handleError(res, error);
  }
};

// READ ONE - GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    if (invalidId(req.params.id, res)) return;
    const job = await Job.findOne({ _id: req.params.id, user: req.user.id });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    handleError(res, error);
  }
};

// UPDATE - PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    if (invalidId(req.params.id, res)) return;
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      pick(req.body),
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE - DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    if (invalidId(req.params.id, res)) return;
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};
