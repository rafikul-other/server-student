import * as adminService from "../Services/adminService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { checkDailyLimit } from "../utils/dailyEntryCheck.js";

export const createAdmin = async (req, res, next) => {
  try {
    const limitCheck = await checkDailyLimit();
    if (!limitCheck.allowed) {
      return errorResponse(
        res,
        `Daily entry limit reached (${limitCheck.count}/${limitCheck.limit}). Please try again tomorrow.`,
        429
      );
    }
    const { name, email, password, adminId, assignedManagers } = req.body;
    if (!name || !password || !adminId) {
      return errorResponse(res, "Name, Admin ID, and password are required", 400);
    }
    const result = await adminService.createAdmin(req.body);
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, result.message, result.data, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await adminService.getAllAdmins();
    return successResponse(res, "Admins fetched", { admins, total: admins.length });
  } catch (error) {
    next(error);
  }
};

export const getAdminById = async (req, res, next) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    if (!admin) return errorResponse(res, "Admin not found", 404);
    return successResponse(res, "Admin fetched", admin);
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const result = await adminService.updateAdmin(req.params.id, req.body);
    if (!result) return errorResponse(res, "Admin not found", 404);
    if (result.success === false) return errorResponse(res, result.message, 400);
    return successResponse(res, "Admin updated", result);
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    const admin = await adminService.deleteAdmin(req.params.id);
    if (!admin) return errorResponse(res, "Admin not found", 404);
    return successResponse(res, "Admin deleted", admin);
  } catch (error) {
    next(error);
  }
};
