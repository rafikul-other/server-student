import * as departmentManagerService from "../Services/departmentManagerService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

export const createDepartmentManager = async (req, res, next) => {
  try {
    const result = await departmentManagerService.createDepartmentManager(req.body);
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, result.message, result.data, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllDepartmentManagers = async (req, res, next) => {
  try {
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