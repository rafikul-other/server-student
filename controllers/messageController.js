import * as messageService from "../Services/messageService.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { ROLES } from "../config/roles.js";

export const createMessage = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return errorResponse(res, "Subject and message are required", 400);
    }
    const result = await messageService.createMessage({
      fromManager: req.user.id,
      subject,
      message,
    });
    if (!result.success) return errorResponse(res, result.message, 400);
    return successResponse(res, result.message, result.data, 201);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    let messages;

    if (role === ROLES.DEPARTMENT_MANAGER) {
      messages = await messageService.getMessagesForManager(id);
    } else if (role === ROLES.ADMIN) {
      messages = await messageService.getMessagesForAdmin(id);
    } else if (role === ROLES.SUPERADMIN) {
      messages = await messageService.getAllMessages();
    } else {
      return errorResponse(res, "Access denied", 403);
    }

    return successResponse(res, "Messages fetched", messages);
  } catch (error) {
    next(error);
  }
};

export const updateMessageStatus = async (req, res, next) => {
  try {
    const { status, resolution } = req.body;
    if (!status) {
      return errorResponse(res, "Status is required", 400);
    }
    const valid = ["pending", "processing", "done", "rejected"];
    if (!valid.includes(status)) {
      return errorResponse(res, "Invalid status", 400);
    }
    const message = await messageService.updateMessageStatus(req.params.id, { status, resolution });
    if (!message) return errorResponse(res, "Message not found", 404);
    return successResponse(res, "Message status updated", message);
  } catch (error) {
    next(error);
  }
};