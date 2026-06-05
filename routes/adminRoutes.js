import express from "express";
import { createAdmin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin } from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/auth.js";
import { isSuperAdmin, isAdmin } from "../middleware/rbac.js";

const router = express.Router();

router.get("/", authenticateToken, isAdmin, getAllAdmins);
router.get("/:id", authenticateToken, isAdmin, getAdminById);
router.post("/", authenticateToken, isSuperAdmin, createAdmin);
router.put("/:id", authenticateToken, isSuperAdmin, updateAdmin);
router.delete("/:id", authenticateToken, isSuperAdmin, deleteAdmin);

export default router;
