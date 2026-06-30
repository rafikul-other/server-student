import * as authService from "../Services/authService.js";
import * as userLogService from "../Services/userLogService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import config from "../config/index.js";

const getReqMeta = (req) => ({
  ip: req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress || "",
  userAgent: req.headers["user-agent"] || "",
});

const fireLog = (params) => {
  userLogService.createLog(params).catch(() => {});
};

export const superAdminLogin = async (req, res, next) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return errorResponse(res, "ID and password are required", 400);
    }
    const result = await authService.superAdminLogin({ id, password });
    if (!result.success) return errorResponse(res, result.message, 401);

    const meta = getReqMeta(req);
    fireLog({
      userId: config.superAdmin.id || "superadmin",
      userType: "SuperAdmin",
      userName: "SuperAdmin",
      email: "",
      ip: meta.ip,
      userAgent: meta.userAgent,
      latitude: req.body?.latitude,
      longitude: req.body?.longitude,
    });

    return successResponse(res, result.message, { role: result.role }, 200, result.token);
  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return errorResponse(res, "ID and password are required", 400);
    }
    const result = await authService.adminLogin({ id, password });
    if (!result.success) return errorResponse(res, result.message, 401);

    const meta = getReqMeta(req);
    fireLog({
      userId: result.data?._id?.toString() || id,
      userType: "Admin",
      userName: result.data?.name || id,
      email: result.data?.email || "",
      ip: meta.ip,
      userAgent: meta.userAgent,
      latitude: req.body?.latitude,
      longitude: req.body?.longitude,
    });

    return successResponse(res, result.message, { role: result.role }, 200, result.token);
  } catch (error) {
    next(error);
  }
};

export const departmentManagerLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }
    const result = await authService.departmentManagerLogin(req.body);
    if (!result.success) return errorResponse(res, result.message, 401);

    const meta = getReqMeta(req);
    fireLog({
      userId: result.data?._id?.toString() || "",
      userType: "DepartmentManager",
      userName: result.data?.name || email,
      email: result.data?.email || email,
      ip: meta.ip,
      userAgent: meta.userAgent,
      latitude: req.body?.latitude,
      longitude: req.body?.longitude,
    });

    return successResponse(res, result.message, result.data, 200, result.token);
  } catch (error) {
    next(error);
  }
};

export const studentLogin = async (req, res, next) => {
  try {
    const { name, subject } = req.body;
    if (!name || !subject) {
      return errorResponse(res, "Name and subject are required", 400);
    }
    const result = await authService.studentLogin(req.body);
    if (!result.success) return errorResponse(res, result.message, 401);

    const meta = getReqMeta(req);
    fireLog({
      userId: result.data?._id?.toString() || "",
      userType: "Student",
      userName: result.data?.name || name,
      email: "",
      ip: meta.ip,
      userAgent: meta.userAgent,
      latitude: req.body?.latitude,
      longitude: req.body?.longitude,
    });

    return successResponse(res, result.message, result.data, 200, result.token);
  } catch (error) {
    next(error);
  }
};

export const studentRegister = async (req, res, next) => {
  try {
    const result = await authService.studentRegister(req.body);
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, result.message, result.data, 201);
  } catch (error) {
    next(error);
  }
};
