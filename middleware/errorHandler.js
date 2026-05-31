export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: "Validation failed",
      success: false,
      errors: messages,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      message: `${field} already exists`,
      success: false,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
      success: false,
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    success: false,
  });
};

export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    message: `Route ${req.originalUrl} not found`,
    success: false,
  });
};