import express from "express";
import { superAdminLogin, adminLogin, departmentManagerLogin, studentLogin, studentRegister } from "../controllers/authController.js";
import { validateStudent } from "../middleware/validators.js";

const router = express.Router();

router.post("/superadmin/login", superAdminLogin);
router.post("/admin/login", adminLogin);
router.post("/department-manager/login", departmentManagerLogin);
router.post("/student/login", studentLogin);
router.post("/student/register", validateStudent, studentRegister);

export default router;