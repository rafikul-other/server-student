import express from "express";
import { createMessage, getMessages, updateMessageStatus } from "../controllers/messageController.js";
import { authenticateToken } from "../middleware/auth.js";
import { hasRole } from "../middleware/rbac.js";

const router = express.Router();

router.get("/", authenticateToken, getMessages);
router.post("/", authenticateToken, hasRole("DepartmentManager"), createMessage);
router.put("/:id", authenticateToken, hasRole("SuperAdmin", "Admin"), updateMessageStatus);

export default router;