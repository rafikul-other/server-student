import express from "express";
import { getAllStudents, getStudentById, createStudent, bulkRegisterStudents, updateStudent, deleteStudent, updateStudentAboutMe } from "../controllers/studentController.js";
import { authenticateToken } from "../middleware/auth.js";
import { canAccessStudentRecord, isAdmin } from "../middleware/rbac.js";
import { validateBulkStudents, validateStudent } from "../middleware/validators.js";

const router = express.Router();

router.get("/", authenticateToken, isAdmin, getAllStudents);
router.get("/:id", authenticateToken, canAccessStudentRecord("id"), getStudentById);
router.post("/", authenticateToken, isAdmin, validateStudent, createStudent);
router.post("/bulk", authenticateToken, isAdmin, validateBulkStudents, bulkRegisterStudents);
router.put("/:id/about-me", authenticateToken, canAccessStudentRecord("id"), updateStudentAboutMe);
router.put("/:id", authenticateToken, isAdmin, updateStudent);
router.delete("/:id", authenticateToken, isAdmin, deleteStudent);

export default router;
