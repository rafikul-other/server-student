import Student from "../models/Student.js";
import { normalizeString } from "../utils/dateUtils.js";

export const getAllStudents = async () => {
  const students = await Student.find({ isActive: true });
  return students.map((student) => ({
    _id: student._id,
    name: student.name,
    subject: student.subject,
    email: student.email,
    aboutMe: student.aboutMe,
    assignedManager: student.assignedManager,
    totalPresent: student.attendance.filter((a) => a.present === "Present").length,
    totalAbsent: student.attendance.filter((a) => a.present === "Absent").length,
    totalAttendance: student.attendance.length,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
  }));
};

export const getStudentById = async (id) => {
  const student = await Student.findById(id);
  if (!student) return null;
  return {
    ...student.toObject(),
    totalPresent: student.attendance.filter((a) => a.present === "Present").length,
    totalAbsent: student.attendance.filter((a) => a.present === "Absent").length,
    totalAttendance: student.attendance.length,
  };
};

export const createStudent = async ({ name, subject, email }) => {
  const normalizedName = normalizeString(name);
  const normalizedSubject = normalizeString(subject);

  const existing = await Student.findOne({
    $expr: {
      $and: [
        { $eq: [{ $replaceAll: { input: { $toLower: "$name" }, find: " ", replacement: "" } }, normalizedName] },
        { $eq: [{ $replaceAll: { input: { $toLower: "$subject" }, find: " ", replacement: "" } }, normalizedSubject] },
      ],
    },
  });
  if (existing) {
    return { success: false, message: "Student with same name and subject already exists" };
  }
  const student = new Student({ name, subject, email });
  await student.save();
  return { success: true, message: "Student created successfully", data: student };
};

export const bulkRegisterStudents = async (students) => {
  const results = { success: [], failed: [] };
  for (const { name, subject, email } of students) {
    const normalizedName = normalizeString(name);
    const normalizedSubject = normalizeString(subject);

    const existing = await Student.findOne({
      $expr: {
        $and: [
          { $eq: [{ $replaceAll: { input: { $toLower: "$name" }, find: " ", replacement: "" } }, normalizedName] },
          { $eq: [{ $replaceAll: { input: { $toLower: "$subject" }, find: " ", replacement: "" } }, normalizedSubject] },
        ],
      },
    });

    if (existing) {
      results.failed.push({ name, subject, reason: "Already exists" });
    } else {
      const student = new Student({ name, subject, email });
      await student.save();
      results.success.push({ name, subject, _id: student._id });
    }
  }
  return results;
};

export const updateStudent = async (id, updates) => {
  const student = await Student.findByIdAndUpdate(id, updates, { new: true });
  if (!student) return null;
  return student;
};

export const deleteStudent = async (id) => {
  const student = await Student.findByIdAndUpdate(id, { isActive: false }, { new: true });
  return student;
};

export const updateStudentAboutMe = async (id, aboutMe) => {
  const student = await Student.findByIdAndUpdate(id, { aboutMe }, { new: true });
  if (!student) return null;
  return student;
};

export const getStudentsByManager = async (managerId) => {
  return Student.find({ assignedManager: managerId, isActive: true });
};