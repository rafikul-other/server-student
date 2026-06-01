import express from "express";
import { markAttendance, updateAttendance, getStudentAttendance, getAttendanceReport } from "../controllers/attendanceController.js";
import { authenticateToken } from "../middleware/auth.js";
import { canAccessStudentRecord, canViewReports, isDepartmentManager } from "../middleware/rbac.js";
import { validateAttendance } from "../middleware/validators.js";

const router = express.Router();

router.post("/mark", authenticateToken, isDepartmentManager, validateAttendance, markAttendance);
router.put("/:studentId", authenticateToken, isDepartmentManager, updateAttendance);
router.get("/student/:studentId", authenticateToken, canAccessStudentRecord("studentId"), getStudentAttendance);
router.get("/report", authenticateToken, canViewReports, getAttendanceReport);

export default router;
