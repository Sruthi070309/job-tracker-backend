import mongoose from "mongoose";

const openingSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Job", "Internship"], required: true },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    mode: { type: String, enum: ["On-site", "Hybrid", "Remote"], default: "On-site" },
    pay: { type: String, trim: true },
    about: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Opening", openingSchema);
