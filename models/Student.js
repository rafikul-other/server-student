import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    present: { type: String, enum: ["Present", "Absent"], required: true },
    markedBy: { type: String, enum: ["self", "admin", "manager"], default: "admin" },
  },
  { timestamps: true }
);

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    email: { type: String, default: "" },
    attendance: { type: [AttendanceSchema], default: [] },
    aboutMe: { type: String, default: "" },
    assignedManager: { type: mongoose.Schema.Types.ObjectId, ref: "DepartmentManager", default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StudentSchema.index({ name: 1, subject: 1 });

const Student = mongoose.model("Student", StudentSchema);
export default Student;