import mongoose from "mongoose";
import Opening from "../models/Opening.js";

const fields = ["type", "title", "company", "location", "mode", "pay", "about"];
const pick = (body) =>
  Object.fromEntries(fields.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

const handleError = (res, error) => {
  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }
  return res.status(500).json({ message: "Server error", error: error.message });
};

const invalidId = (id, res) => {
  if (mongoose.isValidObjectId(id)) return false;
  res.status(400).json({ message: "Invalid opening id" });
  return true;
};

// GET /api/openings?type=Job&q=react&location=Chennai   (public)
export const getOpenings = async (req, res) => {
  try {
    const { type, q, location } = req.query;
    const filter = {};
    if (type) filter.type = String(type); // String() blocks query-object tricks like ?type[$ne]=x
    if (location) filter.location = String(location);
    if (q) {
      const safe = String(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape special characters
      const rx = new RegExp(safe, "i");
      filter.$or = [{ title: rx }, { company: rx }];
    }
    const openings = await Opening.find(filter).sort({ createdAt: -1 });
    res.status(200).json(openings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/openings   (admin only)
export const createOpening = async (req, res) => {
  try {
    const opening = await Opening.create(pick(req.body));
    res.status(201).json({ message: "Opening created successfully", opening });
  } catch (error) {
    handleError(res, error);
  }
};

// PUT /api/openings/:id   (admin only)
export const updateOpening = async (req, res) => {
  try {
    if (invalidId(req.params.id, res)) return;
    const opening = await Opening.findByIdAndUpdate(req.params.id, pick(req.body), {
      new: true,
      runValidators: true,
    });
    if (!opening) return res.status(404).json({ message: "Opening not found" });
    res.status(200).json({ message: "Opening updated successfully", opening });
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE /api/openings/:id   (admin only)
export const deleteOpening = async (req, res) => {
  try {
    if (invalidId(req.params.id, res)) return;
    const opening = await Opening.findByIdAndDelete(req.params.id);
    if (!opening) return res.status(404).json({ message: "Opening not found" });
    res.status(200).json({ message: "Opening deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};
