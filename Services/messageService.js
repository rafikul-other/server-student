import Message from "../models/Message.js";
import Admin from "../models/Admin.js";
import DepartmentManager from "../models/DepartmentManager.js";

export const createMessage = async ({ fromManager, subject, message, studentName }) => {
  const manager = await DepartmentManager.findById(fromManager);
  if (!manager) {
    return { success: false, message: "Manager not found" };
  }

  const admin = await Admin.findOne({ assignedManagers: fromManager, isActive: true });
  if (!admin) {
    return { success: false, message: "No admin assigned to this manager yet" };
  }

  const msg = new Message({
    fromManager,
    fromName: manager.name,
    fromDepartment: manager.department,
    toAdmin: admin._id,
    toName: admin.name,
    subject,
    studentName: studentName || "",
    message,
  });

  await msg.save();
  return { success: true, message: "Message sent", data: msg.toObject() };
};

const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export const getMessagesForManager = async (managerId) => {
  if (!isValidObjectId(managerId)) return [];
  return Message.find({ fromManager: managerId }).sort({ createdAt: -1 });
};

export const getMessagesForAdmin = async (adminId) => {
  if (!isValidObjectId(adminId)) {
    const admin = await Admin.findOne({ adminId });
    if (!admin) return [];
    return Message.find({ toAdmin: admin._id }).sort({ createdAt: -1 });
  }
  return Message.find({ toAdmin: adminId }).sort({ createdAt: -1 });
};

export const getAllMessages = async () => {
  return Message.find().sort({ createdAt: -1 }).populate("fromManager", "name department").populate("toAdmin", "name");
};

export const updateMessageStatus = async (messageId, { status, resolution }) => {
  const msg = await Message.findByIdAndUpdate(
    messageId,
    { status, ...(resolution !== undefined && { resolution }) },
    { new: true }
  );
  if (!msg) return null;
  return msg.toObject();
};