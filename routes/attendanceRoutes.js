import express from "express";
import { markAttendance, updateAttendance, getStudentAttendance, getAttendanceReport } from "../controllers/attendanceController.js";
import { authenticateToken } from "../middleware/auth.js";
import { isDepartmentManager, isAdmin } from "../middleware/rbac.js";

const router = express.Router();

router.post("/mark", authenticateToken, isDepartmentManager, markAttendance);
router.put("/:studentId", authenticateToken, isDepartmentManager, updateAttendance);
router.get("/student/:studentId", getStudentAttendance);
router.get("/report", authenticateToken, isAdmin, getAttendanceReport);

export default router;
