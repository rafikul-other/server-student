import * as authService from "../Services/authService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

export const superAdminLogin = async (req, res, next) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return errorResponse(res, "ID and password are required", 400);
    }
    const result = await authService.superAdminLogin({ id, password });
    if (!result.success) return errorResponse(res, result.message, 401);
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
