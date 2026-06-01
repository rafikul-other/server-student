import DepartmentManager from "../models/DepartmentManager.js";

export const createDepartmentManager = async ({ name, email, password, department }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await DepartmentManager.findOne({ email: normalizedEmail });
  if (existing) {
    return { success: false, message: "Department manager with this email already exists" };
  }
  const manager = new DepartmentManager({ name, email: normalizedEmail, password, department });
  await manager.save();
  return { success: true, message: "Department manager created", data: manager.toObject() };
};

export const getAllDepartmentManagers = async () => {
  return DepartmentManager.find({ isActive: true }).select("-password");
};

export const getDepartmentManagerById = async (id) => {
  return DepartmentManager.findById(id).select("-password");
};

export const updateDepartmentManager = async (id, updates) => {
  const manager = await DepartmentManager.findById(id).select("+password");
  if (!manager) return null;

  const safeUpdates = { ...updates };
  if (safeUpdates.email) {
    safeUpdates.email = safeUpdates.email.trim().toLowerCase();
  }

  Object.assign(manager, safeUpdates);
  await manager.save();
  return manager.toObject();
};

export const deleteDepartmentManager = async (id) => {
  const manager = await DepartmentManager.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password");
  return manager;
};
