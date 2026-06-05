import jwt from "jsonwebtoken";
import config from "../config/index.js";
import Student from "../models/Student.js";
import { normalizeString } from "../utils/dateUtils.js";

export const createToken = (payload) => {
  return jwt.sign(payload, config.secretKey, { expiresIn: "7d" });
};

export const superAdminLogin = async ({ id, password }) => {
  if (id !== config.superAdmin.id || password !== config.superAdmin.password) {
    return { success: false, message: "Invalid superadmin credentials" };
  }
  const token = createToken({ id: config.superAdmin.id, role: "SuperAdmin" });
  return { success: true, message: "SuperAdmin Login Successful", role: "SuperAdmin", token };
};

export const adminLogin = async ({ id, password }) => {
  if (id === config.admin.id && password === config.admin.password) {
    const token = createToken({ id: config.admin.id, role: "Admin" });
    return { success: true, message: "Admin Login Successful", role: "Admin", token };
  }

  const Admin = (await import("../models/Admin.js")).default;
  const admin = await Admin.findOne({ email: id.toLowerCase() }).select("+password");
  if (!admin || !admin.isActive) {
    return { success: false, message: "Invalid admin credentials" };
  }
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return { success: false, message: "Invalid admin credentials" };
  }
  const token = createToken({ id: admin._id.toString(), role: "Admin" });
  return {
    success: true,
    message: "Admin Login Successful",
    data: { _id: admin._id, name: admin.name, email: admin.email, role: "Admin" },
    token,
  };
};

export const departmentManagerLogin = async ({ email, password }) => {
  const DepartmentManager = (await import("../models/DepartmentManager.js")).default;
  const manager = await DepartmentManager.findOne({ email }).select("+password");
  if (!manager || !manager.isActive) {
    return { success: false, message: "Invalid credentials or account inactive" };
  }
  const isMatch = await manager.comparePassword(password);
  if (!isMatch) {
    return { success: false, message: "Invalid credentials" };
  }
  const token = createToken({ id: manager._id.toString(), role: "DepartmentManager" });
  return {
    success: true,
    message: "Department Manager Login Successful",
    data: { _id: manager._id, name: manager.name, email: manager.email, department: manager.department, role: "DepartmentManager" },
    token,
  };
};

export const studentLogin = async ({ name, subject }) => {
  const normalizedName = normalizeString(name);
  const normalizedSubject = normalizeString(subject);

  const student = await Student.findOne({
    $expr: {
      $and: [
        { $eq: [{ $replaceAll: { input: { $toLower: "$name" }, find: " ", replacement: "" } }, normalizedName] },
        { $eq: [{ $replaceAll: { input: { $toLower: "$subject" }, find: " ", replacement: "" } }, normalizedSubject] },
      ],
    },
    isActive: true,
  });

  if (!student) {
    return { success: false, message: "Invalid credentials. Please check your name and course." };
  }

  const token = createToken({ id: student._id.toString(), role: "Student" });
  return {
    success: true,
    message: "Student Login Successful",
    data: { _id: student._id, name: student.name, subject: student.subject, aboutMe: student.aboutMe },
    token,
  };
};

export const studentRegister = async ({ name, subject }) => {
  const existingStudent = await Student.findOne({
    $expr: {
      $and: [
        { $eq: [{ $replaceAll: { input: { $toLower: "$name" }, find: " ", replacement: "" } }, normalizeString(name)] },
        { $eq: [{ $replaceAll: { input: { $toLower: "$subject" }, find: " ", replacement: "" } }, normalizeString(subject)] },
      ],
    },
    isActive: true,
  });
  if (existingStudent) {
    return { success: false, message: "Student already exists" };
  }
  const newStudent = new Student({ name, subject });
  await newStudent.save();
  return { success: true, message: "Student Registration Successful", data: newStudent };
};
