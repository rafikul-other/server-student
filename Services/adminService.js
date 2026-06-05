import Admin from "../models/Admin.js";

export const createAdmin = async ({ name, email, password, assignedManager }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await Admin.findOne({ email: normalizedEmail });
  if (existing) {
    return { success: false, message: "Admin with this email already exists" };
  }
  const admin = new Admin({ name, email: normalizedEmail, password, assignedManager });
  await admin.save();
  return { success: true, message: "Admin created", data: admin.toObject() };
};

export const getAllAdmins = async () => {
  return Admin.find({ isActive: true }).select("-password").populate("assignedManager", "name department");
};

export const getAdminById = async (id) => {
  return Admin.findById(id).select("-password").populate("assignedManager", "name department");
};

export const updateAdmin = async (id, updates) => {
  const admin = await Admin.findById(id).select("+password");
  if (!admin) return null;

  const safeUpdates = { ...updates };
  if (safeUpdates.email) {
    safeUpdates.email = safeUpdates.email.trim().toLowerCase();
  }

  Object.assign(admin, safeUpdates);
  await admin.save();
  return admin.toObject();
};

export const deleteAdmin = async (id) => {
  const admin = await Admin.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password");
  return admin;
};

export const findAdminByEmail = async (email) => {
  return Admin.findOne({ email: email.toLowerCase() }).select("+password");
};
