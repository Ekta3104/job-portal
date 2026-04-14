const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: [2000, "Description must be under 2000 characters"],
    },
    logoUrl: {
      type: String,
      default: "",
    },

    // Company is owned by one employer account.
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    employeeCount: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
      default: "1-10",
    },
    industry: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.index({ owner: 1 });
companySchema.index({ name: "text", description: "text", industry: "text" });

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
