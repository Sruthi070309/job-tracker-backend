import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: [true, "company is required"], trim: true },
  role: { type: String, required: [true, "role is required"], trim: true },
  location: { type: String, trim: true },
  status: {
    type: String,
    enum: ["Applied", "Interview Scheduled", "Offer", "Rejected"],
    default: "Applied",
  },
  applicationDate: { type: Date, default: Date.now },
});

export default mongoose.model("Job", jobSchema);
