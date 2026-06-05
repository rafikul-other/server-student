import express from "express";
import { getAllStudents, getStudentById, createStudent, bulkRegisterStudents, updateStudent, deleteStudent, updateStudentAboutMe } from "../controllers/studentController.js";
import { authenticateToken } from "../middleware/auth.js";
import { canAccessStudentRecord, isAdmin, isDepartmentManager } from "../middleware/rbac.js";
import { validateBulkStudents, validateStudent } from "../middleware/validators.js";

const router = express.Router();

router.get("/", authenticateToken, isDepartmentManager, getAllStudents);
router.get("/:id", authenticateToken, canAccessStudentRecord("id"), getStudentById);
router.post("/", authenticateToken, isDepartmentManager, validateStudent, createStudent);
router.post("/bulk", authenticateToken, isDepartmentManager, validateBulkStudents, bulkRegisterStudents);
router.put("/:id/about-me", authenticateToken, canAccessStudentRecord("id"), updateStudentAboutMe);
router.put("/:id", authenticateToken, isDepartmentManager, updateStudent);
router.delete("/:id", authenticateToken, isDepartmentManager, deleteStudent);

export default router;
