import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

import StudentModel from "../../models/students/StudentModel.js";

const Super_Admin_Id = process.env.SUPER_ADMIN_ID;
const Super_Admin_Password = process.env.SUPER_ADMIN_PASSWORD;

const Admin_Id = process.env.ADMIN_ID;
const Admin_Password = process.env.ADMIN_PASSWORD;

//? SuperAdmin Access

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY);
};

const SuperAdminLogin = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (id === Super_Admin_Id && password === Super_Admin_Password) {
      //? creating token for super admin
      const token = createToken(process.env.SUPER_ADMIN_ID);
      res.status(200).json({
        message: "SuperAdmin Login Successful",
        type: "SuperAdmin",
        success: true,
        token: token,
      });
    } else {
      res
        .status(401)
        .json({ message: "Invalid credentials on SuperAdmin", success: false });
    }
  } catch (error) {
    console.error("Error while login in SuperAdmin : " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//? Admin Access

const AdminLogin = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (id === Admin_Id && password === Admin_Password) {
      //? creating token for admin
      const token = createToken(process.env.ADMIN_ID);
      res.status(200).json({
        message: "Admin Login Successful",
        type: "Admin",
        success: true,
        token: token,
      });
    } else {
      res
        .status(401)
        .json({ message: "Invalid credentials on Admin", success: false });
    }
  } catch (error) {
    console.error("Error while login in Admin : " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//? Student Registration
const StudentRegister = async (req, res) => {
  try {
    const { name, subject } = req.body;
    const newStudent = new StudentModel({ name, subject });
    await newStudent.save();
    res.status(201).json({
      message: "Student Registration Successful",
      success: true,
      data: newStudent,
    });
  } catch (error) {
    console.error("Error while registering Student in Database : " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const StudentLogin = async (req, res) => {
  try {
    const { name, subject } = req.body;

    // Function to normalize strings: remove spaces and convert to lowercase
    const normalizeString = (str) =>
      str.trim().toLowerCase().replace(/\s+/g, "");

    // Normalize the input values
    const normalizedInputName = normalizeString(name);
    const normalizedInputSubject = normalizeString(subject);

    // Fetch student by normalizing the database values in the query
    const student = await StudentModel.findOne({
      $expr: {
        $and: [
          {
            $eq: [
              {
                $replaceAll: {
                  input: { $toLower: "$name" },
                  find: " ",
                  replacement: "",
                },
              },
              normalizedInputName,
            ],
          },
          {
            $eq: [
              {
                $replaceAll: {
                  input: { $toLower: "$subject" },
                  find: " ",
                  replacement: "",
                },
              },
              normalizedInputSubject,
            ],
          },
        ],
      },
    });

    if (student) {
      res.status(200).json({
        message: "Student Login Successful",
        success: true,
        data: student,
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials. Please check your name and course.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error while logging in Student: " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { SuperAdminLogin, AdminLogin, StudentLogin, StudentRegister };
