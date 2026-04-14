const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const apiRoutes = require("./routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Root route for quick browser check.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Portal Backend API",
  });
});

// Base API route (v1)
app.use("/api/v1", apiRoutes);

// Error middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
