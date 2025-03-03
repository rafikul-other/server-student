import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnection from "./utils/dbConnection.js";
import {
  AdminLogin,
  StudentLogin,
  StudentRegister,
  SuperAdminLogin,
} from "./utils/auth/auth.js";
import {
  studentAttendence,
  studentAttendenceUpdate,
  studentDelete,
  studentFetch,
  studentSingleFetch,
} from "./controllers/students/students.js";

const app = express();

//? variables extracted from env file
const PORT = process.env.PORT || 5000;

//? env configuration
dotenv.config();

//? middlewares
app.use(express.json());
app.use(cors("*"));

//? routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

//? connect to MongoDB
dbConnection();

//? superadmin login auth
app.post("/api/v1/superadmin/login", SuperAdminLogin);

//? admin login auth
app.post("/api/v1/admin/login", AdminLogin);

//? student registration
app.post("/api/v1/students/register", StudentRegister);

//? student login auth
app.post("/api/v1/students/login", StudentLogin);

//? student fetching from database
app.get("/api/v1/students/fetch", studentFetch);

//? Single / Particular student fetching from database
app.get("/api/v1/students/fetchSingle/:id", studentSingleFetch);

//? Update Student Attendence related Main api's
app.post("/api/v1/students/attendence", studentAttendence);

//? Delete students from database
app.delete("/api/v1/students/delete", studentDelete);

//? update student specific attendace by Admin
app.put("/api/v1/students/updateAttendance/:id", studentAttendenceUpdate);

//? server listening
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
