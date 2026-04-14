const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Stored for quick employer-side filtering without extra joins.
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeUrl: {
      type: String,
      default: "",
    },
    coverLetter: {
      type: String,
      default: "",
      maxlength: [2000, "Cover letter must be under 2000 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    statusUpdatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications by same user on the same job.
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });
applicationSchema.index({ employer: 1, status: 1, createdAt: -1 });
applicationSchema.index({ applicant: 1, status: 1, createdAt: -1 });

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
