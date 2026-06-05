import Student from "../models/Student.js";
import DepartmentManager from "../models/DepartmentManager.js";
import { ROLES } from "../config/roles.js";
import { normalizeString } from "../utils/dateUtils.js";

export const markAttendance = async ({ name, subject, date, present, markedBy = "admin" }) => {
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
    return { success: false, message: "Student not found" };
  }

  const exists = student.attendance.some((a) => a.date === date);
  if (exists) {
    return { success: false, message: "Attendance already recorded for this date" };
  }

  const updated = await Student.findByIdAndUpdate(
    student._id,
    { $push: { attendance: { date, present, markedBy } } },
    { new: true }
  );

  return { success: true, message: "Attendance marked successfully", data: updated };
};

export const updateAttendance = async (studentId, date, present, markedBy = "admin") => {
  const student = await Student.findById(studentId);
  if (!student) return { success: false, message: "Student not found" };

  const idx = student.attendance.findIndex((a) => a.date === date);
  if (idx === -1) return { success: false, message: "Attendance record not found" };

  student.attendance[idx].present = present;
  if (markedBy) student.attendance[idx].markedBy = markedBy;
  await student.save();

  return { success: true, message: "Attendance updated", data: student };
};

export const getStudentAttendance = async (studentId) => {
  const student = await Student.findOne({ _id: studentId, isActive: true });
  if (!student) return null;
  return student.attendance;
};

export const selfMarkAttendance = async (studentId, present) => {
  const today = new Date().toISOString().split("T")[0];
  const student = await Student.findOne({ _id: studentId, isActive: true });
  if (!student) return { success: false, message: "Student not found" };

  const exists = student.attendance.some((a) => a.date === today);
  if (exists) {
    return { success: false, message: "Attendance already recorded for today" };
  }

  const updated = await Student.findByIdAndUpdate(
    student._id,
    { $push: { attendance: { date: today, present, markedBy: "self" } } },
    { new: true }
  );

  return { success: true, message: "Attendance marked successfully", data: updated };
};

export const markAttendanceById = async (studentId, date, present, markedBy = "admin") => {
  const student = await Student.findOne({ _id: studentId, isActive: true });
  if (!student) return { success: false, message: "Student not found" };

  const exists = student.attendance.some((a) => a.date === date);
  if (exists) {
    return { success: false, message: "Attendance already recorded for this date" };
  }

  const updated = await Student.findByIdAndUpdate(
    student._id,
    { $push: { attendance: { date, present, markedBy } } },
    { new: true }
  );

  return { success: true, message: "Attendance marked successfully", data: updated };
};

const getReportQuery = async ({ subject, user }) => {
  const query = { isActive: true };

  if (subject) {
    query.subject = subject;
  }

  if (!user) {
    return query;
  }

  if (user.role === ROLES.STUDENT) {
    query._id = user.id;
    return query;
  }

  if (user.role === ROLES.DEPARTMENT_MANAGER) {
    const manager = await DepartmentManager.findById(user.id).select("department");
    const managerScope = [{ assignedManager: user.id }];

    if (manager?.department) {
      managerScope.push({ subject: manager.department });
    }

    query.$or = managerScope;
  }

  return query;
};

export const getAttendanceReport = async (filters = {}) => {
  const { subject, month, year, user } = filters;
  const query = await getReportQuery({ subject, user });

  const students = await Student.find(query).lean();
  const report = {
    totalStudents: students.length,
    totalPresent: 0,
    totalAbsent: 0,
    overallAttendanceRate: "0%",
    bySubject: {},
    recentRecords: [],
  };

  const filterByMonth = (attendance) => {
    if (!month || !year) return attendance;
    return attendance.filter((a) => {
      const [y, m] = a.date.split("-");
      return y === year && m === month.padStart(2, "0");
    });
  };

  students.forEach((student) => {
    const monthAttendance = filterByMonth(student.attendance);
    const present = monthAttendance.filter((a) => a.present === "Present").length;
    const absent = monthAttendance.filter((a) => a.present === "Absent").length;
    report.totalPresent += present;
    report.totalAbsent += absent;

    if (!report.bySubject[student.subject]) {
      report.bySubject[student.subject] = { total: 0, present: 0, absent: 0, students: 0 };
    }
    report.bySubject[student.subject].total += monthAttendance.length;
    report.bySubject[student.subject].present += present;
    report.bySubject[student.subject].absent += absent;
    report.bySubject[student.subject].students += 1;

    monthAttendance.slice(-5).forEach((a) => {
      report.recentRecords.push({ student: student.name, subject: student.subject, ...a });
    });
  });

  const total = report.totalPresent + report.totalAbsent;
  report.overallAttendanceRate = total > 0 ? `${((report.totalPresent / total) * 100).toFixed(1)}%` : "0%";

  return report;
};
