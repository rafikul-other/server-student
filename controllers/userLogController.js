import * as userLogService from "../Services/userLogService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

export const getLogs = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await userLogService.getLogs({ page, limit });
    return successResponse(res, "User logs fetched", result, 200);
  } catch (error) {
    next(error);
  }
};

export const updateLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const log = await userLogService.updateLog(id, req.body);
    return successResponse(res, "User log updated", log, 200);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};

export const deleteLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userLogService.deleteLog(id);
    return successResponse(res, "User log deleted", null, 200);
  } catch (error) {
    if (error.statusCode) {
      return errorResponse(res, error.message, error.statusCode);
    }
    next(error);
  }
};
