import express from "express";
import { getLogs, updateLog, deleteLog } from "../controllers/userLogController.js";
import { authenticateToken } from "../middleware/auth.js";
import { isSuperAdmin } from "../middleware/rbac.js";

const router = express.Router();

router.get("/", authenticateToken, isSuperAdmin, getLogs);
router.put("/:id", authenticateToken, isSuperAdmin, updateLog);
router.delete("/:id", authenticateToken, isSuperAdmin, deleteLog);

export default router;
