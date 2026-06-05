import Admin from "../models/Admin.js";

export const createAdmin = async ({ name, email, password, adminId, assignedManagers }) => {
  if (!adminId) {
    return { success: false, message: "Admin ID is required" };
  }
  const normalizedAdminId = adminId.trim();
  const existingId = await Admin.findOne({ adminId: normalizedAdminId, isActive: true });
  if (existingId) {
    return { success: false, message: "Admin ID already exists" };
  }
  if (email) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingEmail = await Admin.findOne({ email: normalizedEmail, isActive: true });
    if (existingEmail) {
      return { success: false, message: "Email already taken by another admin" };
    }
  }
  const adminData = { name, password, adminId: normalizedAdminId, assignedManagers: assignedManagers || [] };
  if (email) adminData.email = email.trim().toLowerCase();
  const admin = new Admin(adminData);
  await admin.save();
  return { success: true, message: "Admin created", data: admin.toObject() };
};

export const getAllAdmins = async () => {
  return Admin.find({ isActive: true }).select("-password").populate("assignedManagers", "name department");
};

export const getAdminById = async (id) => {
  return Admin.findById(id).select("-password").populate("assignedManagers", "name department");
};

export const updateAdmin = async (id, updates) => {
  const admin = await Admin.findById(id).select("+password");
  if (!admin) return null;

  const safeUpdates = { ...updates };
  if (safeUpdates.email === "") {
    delete safeUpdates.email;
  }
  if (safeUpdates.email) {
    safeUpdates.email = safeUpdates.email.trim().toLowerCase();
  }
  if (safeUpdates.adminId) {
    safeUpdates.adminId = safeUpdates.adminId.trim();
    const existing = await Admin.findOne({ adminId: safeUpdates.adminId, _id: { $ne: id }, isActive: true });
    if (existing) {
      return { success: false, message: "Admin ID already taken" };
    }
  }
  if (safeUpdates.email) {
    const existingEmail = await Admin.findOne({ email: safeUpdates.email, _id: { $ne: id }, isActive: true });
    if (existingEmail) {
      return { success: false, message: "Email already taken by another admin" };
    }
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
  return Admin.findOne({ email: email.toLowerCase(), isActive: true }).select("+password");
};
