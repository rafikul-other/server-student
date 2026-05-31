import express from "express";
import { createDepartmentManager, getAllDepartmentManagers, getDepartmentManagerById, updateDepartmentManager, deleteDepartmentManager } from "../controllers/departmentManagerController.js";
import { authenticateToken } from "../middleware/auth.js";
import { isSuperAdmin } from "../middleware/rbac.js";

const router = express.Router();

router.get("/", authenticateToken, isSuperAdmin, getAllDepartmentManagers);
router.get("/:id", authenticateToken, isSuperAdmin, getDepartmentManagerById);
router.post("/", authenticateToken, isSuperAdmin, createDepartmentManager);
router.put("/:id", authenticateToken, isSuperAdmin, updateDepartmentManager);
router.delete("/:id", authenticateToken, isSuperAdmin, deleteDepartmentManager);

export default router;
