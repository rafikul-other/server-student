import * as studentService from "../Services/studentService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";

export const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();
    return successResponse(res, "Students loaded successfully", { students, total: students.length });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) return errorResponse(res, "Student not found", 404);
    return successResponse(res, "Student fetched successfully", student);
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req, res, next) => {
  try {
    const result = await studentService.createStudent(req.body);
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, result.message, result.data, 201);
  } catch (error) {
    next(error);
  }
};

export const bulkRegisterStudents = async (req, res, next) => {
  try {
    const { students } = req.body;
    const result = await studentService.bulkRegisterStudents(students);
    return res.status(201).json({
      message: "Bulk registration completed",
      success: true,
      data: {
        successCount: result.success.length,
        failedCount: result.failed.length,
        successRecords: result.success,
        failedRecords: result.failed,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    if (!student) return errorResponse(res, "Student not found", 404);
    return successResponse(res, "Student updated successfully", student);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    const student = await studentService.deleteStudent(req.params.id);
    if (!student) return errorResponse(res, "Student not found", 404);
    return successResponse(res, "Student deleted successfully", student);
  } catch (error) {
    next(error);
  }
};

export const updateStudentAboutMe = async (req, res, next) => {
  try {
    const { aboutMe } = req.body;
    if (aboutMe === undefined) return errorResponse(res, "aboutMe field is required", 400);
    const student = await studentService.updateStudentAboutMe(req.params.id, aboutMe);
    if (!student) return errorResponse(res, "Student not found", 404);
    return successResponse(res, "About Me updated successfully", student);
  } catch (error) {
    next(error);
  }
};