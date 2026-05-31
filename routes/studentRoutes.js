import express from "express";
import { getAllStudents, getStudentById, createStudent, bulkRegisterStudents, updateStudent, deleteStudent, updateStudentAboutMe } from "../controllers/studentController.js";
import { authenticateToken } from "../middleware/auth.js";
import { isAdmin } from "../middleware/rbac.js";

const router = express.Router();

router.get("/", authenticateToken, isAdmin, getAllStudents);
router.get("/:id", authenticateToken, isAdmin, getStudentById);
router.post("/", authenticateToken, isAdmin, createStudent);
router.post("/bulk", authenticateToken, isAdmin, bulkRegisterStudents);
router.put("/:id", authenticateToken, isAdmin, updateStudent);
router.delete("/:id", authenticateToken, isAdmin, deleteStudent);
router.put("/:id/about-me", updateStudentAboutMe);

export default router;
