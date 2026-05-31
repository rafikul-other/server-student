import { ROLES } from "../config/roles.js";

export const validateLogin = (req, res, next) => {
  const { id, password, role } = req.body;

  if (!id || !password) {
    return res.status(400).json({ message: "ID and password are required", success: false });
  }

  if (!role || !Object.values(ROLES).includes(role)) {
    return res.status(400).json({ message: "Valid role is required", success: false });
  }

  if (role === ROLES.STUDENT && (!req.body.name || !req.body.subject)) {
    return res.status(400).json({ message: "Name and subject are required for students", success: false });
  }

  next();
};

export const validateStudent = (req, res, next) => {
  const { name, subject } = req.body;
  if (!name || !subject) {
    return res.status(400).json({ message: "Name and subject are required", success: false });
  }
  next();
};

export const validateBulkStudents = (req, res, next) => {
  const { students } = req.body;
  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: "Students array is required and must not be empty", success: false });
  }
  const invalid = students.filter((s) => !s.name || !s.subject);
  if (invalid.length > 0) {
    return res.status(400).json({
      message: `${invalid.length} student(s) missing name or subject`,
      success: false,
      invalidRows: invalid.map((s, i) => ({ row: i + 1, name: s.name, subject: s.subject })),
    });
  }
  next();
};

export const validateAttendance = (req, res, next) => {
  const { name, subject, date, present } = req.body;
  if (!name || !subject || !date || !present) {
    return res.status(400).json({ message: "name, subject, date, and present are required", success: false });
  }
  if (!["Present", "Absent"].includes(present)) {
    return res.status(400).json({ message: "present must be 'Present' or 'Absent'", success: false });
  }
  next();
};