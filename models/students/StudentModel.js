import mongoose from "mongoose";

const AttendenceSchema = new mongoose.Schema(
  {
    time: { type: String, required: true },
    present: { type: String, required: true },
  },
  { timestamps: true }
);

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    attendence: { type: [AttendenceSchema], default: [] },
  },
  { timestamps: true }
);

const StudentModel = mongoose.model("Student", StudentSchema);
export default StudentModel;
   