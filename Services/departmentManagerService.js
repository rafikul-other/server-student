import DepartmentManager from "../models/DepartmentManager.js";

export const createDepartmentManager = async ({ name, email, password, department }) => {
  const existing = await DepartmentManager.findOne({ email });
  if (existing) {
    return { success: false, message: "Department manager with this email already exists" };
  }
  const manager = new DepartmentManager({ name, email, password, department });
  await manager.save();
  return { success: true, message: "Department manager created", data: manager };
};

export const getAllDepartmentManagers = async () => {
  return DepartmentManager.find({ isActive: true }).select("-password");
};

export const getDepartmentManagerById = async (id) => {
  return DepartmentManager.findById(id).select("-password");
};

export const updateDepartmentManager = async (id, updates) => {
  const manager = await DepartmentManager.findByIdAndUpdate(id, updates, { new: true }).select("-password");
  return manager;
};

export const deleteDepartmentManager = async (id) => {
  const manager = await DepartmentManager.findByIdAndUpdate(id, { isActive: false }, { new: true }).select("-password");
  return manager;
};