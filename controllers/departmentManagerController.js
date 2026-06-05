import * as departmentManagerService from "../Services/departmentManagerService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { checkDailyLimit } from "../utils/dailyEntryCheck.js";

export const createDepartmentManager = async (req, res, next) => {
  try {
    const limitCheck = await checkDailyLimit();
    if (!limitCheck.allowed) {
      return errorResponse(
        res,
        `Daily entry limit reached (${limitCheck.count}/${limitCheck.limit}). Please try again tomorrow.`,
        429
      );
    }
    const { name, email, password, department } = req.body;
    if (!name || !email || !password || !department) {
      return errorResponse(res, "Name, email, password, and department are required", 400);
    }
    const result = await departmentManagerService.createDepartmentManager(req.body);
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, result.message, result.data, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllDepartmentManagers = async (req, res, next) => {
  try {
    if (req.user.role === "DepartmentManager") {
      const manager = await departmentManagerService.getDepartmentManagerById(req.user.id);
      if (!manager) return errorResponse(res, "Department manager not found", 404);
      return successResponse(res, "Department manager fetched", { managers: [manager], total: 1 });
    }
    const managers = await departmentManagerService.getAllDepartmentManagers();
    return successResponse(res, "Department managers fetched", { managers, total: managers.length });
  } catch (error) {
    next(error);
  }
};

export const getDepartmentManagerById = async (req, res, next) => {
  try {
    const manager = await departmentManagerService.getDepartmentManagerById(req.params.id);
    if (!manager) return errorResponse(res, "Department manager not found", 404);
    return successResponse(res, "Department manager fetched", manager);
  } catch (error) {
    next(error);
  }
};

export const updateDepartmentManager = async (req, res, next) => {
  try {
    const manager = await departmentManagerService.updateDepartmentManager(req.params.id, req.body);
    if (!manager) return errorResponse(res, "Department manager not found", 404);
    return successResponse(res, "Department manager updated", manager);
  } catch (error) {
    next(error);
  }
};

export const deleteDepartmentManager = async (req, res, next) => {
  try {
    const manager = await departmentManagerService.deleteDepartmentManager(req.params.id);
    if (!manager) return errorResponse(res, "Department manager not found", 404);
    return successResponse(res, "Department manager deleted", manager);
  } catch (error) {
    next(error);
  }
};
