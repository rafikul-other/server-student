import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    city: { type: String, default: "" },
    region: { type: String, default: "" },
    country: { type: String, default: "" },
    lat: { type: Number, default: null },
    lon: { type: Number, default: null },
  },
  { _id: false }
);

const UserLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userType: {
      type: String,
      enum: ["SuperAdmin", "Admin", "DepartmentManager", "Student"],
      required: true,
    },
    userName: { type: String, required: true },
    email: { type: String, default: "" },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    location: { type: LocationSchema, default: () => ({}) },
  },
  { timestamps: true }
);

UserLogSchema.index({ createdAt: -1 });
UserLogSchema.index({ userType: 1, createdAt: -1 });

const UserLog = mongoose.model("UserLog", UserLogSchema);
export default UserLog;
