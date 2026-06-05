import * as attendanceService from "../Services/attendanceService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

export const markAttendance = async (req, res, next) => {
  try {
    const { name, subject, date, present } = req.body;
    const result = await attendanceService.markAttendance({ name, subject, date, present });
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, result.message, result.data);
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const { date, present } = req.body;
    const result = await attendanceService.updateAttendance(req.params.studentId, date, present);
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, result.message, result.data);
  } catch (error) {
    next(error);
  }
};

export const getStudentAttendance = async (req, res, next) => {
  try {
    const attendance = await attendanceService.getStudentAttendance(req.params.studentId);
    if (!attendance) return errorResponse(res, "Student not found", 404);
    return successResponse(res, "Attendance fetched", attendance);
  } catch (error) {
    next(error);
  }
};

export const getAttendanceReport = async (req, res, next) => {
  try {
    const { subject } = req.query;
    const report = await attendanceService.getAttendanceReport({ subject, user: req.user });
    return successResponse(res, "Attendance report generated", report);
  } catch (error) {
    next(error);
  }
};

export const selfMarkAttendance = async (req, res, next) => {
  try {
    const { present } = req.body;
    const result = await attendanceService.selfMarkAttendance(req.user.id, present);
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, result.message, result.data);
  } catch (error) {
    next(error);
  }
};

export const markAttendanceById = async (req, res, next) => {
  try {
    const { date, present } = req.body;
    const result = await attendanceService.markAttendanceById(req.params.studentId, date, present);
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, result.message, result.data);
  } catch (error) {
    next(error);
  }
};
