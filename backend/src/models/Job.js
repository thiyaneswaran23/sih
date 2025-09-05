import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    jobType: { type: String, default: "Full-time" },
    salary: { type: String },
    requirements: [String],
    applyLink: { type: String },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
