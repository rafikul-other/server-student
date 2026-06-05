import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    fromManager: { type: mongoose.Schema.Types.ObjectId, ref: "DepartmentManager", required: true },
    fromName: { type: String, required: true },
    fromDepartment: { type: String, required: true },
    toAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    toName: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "processing", "done", "rejected"], default: "pending" },
    resolution: { type: String, default: "" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);
export default Message;