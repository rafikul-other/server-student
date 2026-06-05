import express from "express";
import { markAttendance, updateAttendance, getStudentAttendance, getAttendanceReport, selfMarkAttendance, markAttendanceById } from "../controllers/attendanceController.js";
import { authenticateToken } from "../middleware/auth.js";
import { canAccessStudentRecord, canViewReports, isDepartmentManager, isStudent } from "../middleware/rbac.js";
import { validateAttendance, validateSelfAttendance, validateMarkById } from "../middleware/validators.js";

const router = express.Router();

router.post("/mark", authenticateToken, isDepartmentManager, validateAttendance, markAttendance);
router.post("/self-mark", authenticateToken, isStudent, selfMarkAttendance);
router.post("/:studentId/mark", authenticateToken, isDepartmentManager, validateMarkById, markAttendanceById);
router.put("/:studentId", authenticateToken, isDepartmentManager, updateAttendance);
router.get("/student/:studentId", authenticateToken, canAccessStudentRecord("studentId"), getStudentAttendance);
router.get("/report", authenticateToken, canViewReports, getAttendanceReport);

export default router;
