import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import config from "./config/index.js";
import dbConnection from "./config/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import departmentManagerRoutes from "./routes/departmentManagerRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: config.cors.origin }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "GD College API is running!", version: "2.0" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/department-managers", departmentManagerRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

dbConnection().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
