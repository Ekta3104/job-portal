const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: [String],
      default: [],
    },
    salaryMin: {
      type: Number,
      default: 0,
      min: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      default: "full-time",
    },
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      default: "fresher",
    },

    // Helps jobseeker browse and filter jobs.
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: "text", description: "text", location: "text" });
jobSchema.index({ employer: 1, status: 1, createdAt: -1 });
jobSchema.index({ company: 1 });

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
