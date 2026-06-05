import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    isActive: { type: Boolean, default: true },
    assignedManager: { type: mongoose.Schema.Types.ObjectId, ref: "DepartmentManager", default: null },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const hidePassword = (_doc, ret) => {
  delete ret.password;
  return ret;
};

AdminSchema.set("toJSON", { transform: hidePassword });
AdminSchema.set("toObject", { transform: hidePassword });

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
