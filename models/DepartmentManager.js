import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const DepartmentManagerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    department: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DepartmentManagerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

DepartmentManagerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const hidePassword = (_doc, ret) => {
  delete ret.password;
  return ret;
};

DepartmentManagerSchema.set("toJSON", { transform: hidePassword });
DepartmentManagerSchema.set("toObject", { transform: hidePassword });

const DepartmentManager = mongoose.model("DepartmentManager", DepartmentManagerSchema);
export default DepartmentManager;
