import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { errorResponse } from "../utils/responseHelper.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return errorResponse(res, "Access token required", 401);
  }

  try {
    const decoded = jwt.verify(token, config.secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};

export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.secretKey);
    req.user = decoded;
  } catch {
    req.user = null;
  }
  next();
};