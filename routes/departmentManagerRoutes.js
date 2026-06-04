import express from "express";
import { createDepartmentManager, getAllDepartmentManagers, getDepartmentManagerById, updateDepartmentManager, deleteDepartmentManager } from "../controllers/departmentManagerController.js";
import { authenticateToken } from "../middleware/auth.js";
import { isDepartmentManager, isAdmin } from "../middleware/rbac.js";

const router = express.Router();

router.get("/", authenticateToken, isDepartmentManager, getAllDepartmentManagers);
router.get("/:id", authenticateToken, isDepartmentManager, getDepartmentManagerById);
router.post("/", authenticateToken, isAdmin, createDepartmentManager);
router.put("/:id", authenticateToken, isAdmin, updateDepartmentManager);
router.delete("/:id", authenticateToken, isAdmin, deleteDepartmentManager);

export default router;
