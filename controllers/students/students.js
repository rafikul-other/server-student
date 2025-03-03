import StudentModel from "../../models/students/StudentModel.js";

//? today date to match and update user attendence

const formatDate = () => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const date = new Date();

const exactDate = formatDate(date).split(", ")[1];
const exactYear = formatDate(date).split(", ")[2];

const todayDate = exactDate + " " + exactYear;

// const studentFetch = async (req, res) => {
//   try {
//     const students = await StudentModel.find();
//     const enrolledInDatabase = students.length;
//     res.status(200).json({
//       message: "Students Fetch Successfully",
//       success: true,
//       data: students,
//       totalStudents: enrolledInDatabase,
//     });
//   } catch (error) {
//     console.error("Error while fetching students : " + error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const studentFetch = async (req, res) => {
  try {
    const students = await StudentModel.find();

    // Map through students to calculate totals
    const studentsWithAttendanceStats = students.map((student) => {
      const totalPresent = student.attendence.filter(
        (record) => record.present === "Present"
      ).length;

      const totalAbsent = student.attendence.filter(
        (record) => record.present === "Absent"
      ).length;

      return {
        _id: student._id,
        name: student.name,
        subject: student.subject,
        totalPresent,
        totalAbsent,
        totalAttendance: student.attendence.length,
        attendence: student.attendence,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
      };
    });

    res.status(200).json({
      message: "Students Fetch Successfully",
      success: true,
      data: studentsWithAttendanceStats,
      totalStudents: students.length,
    });
  } catch (error) {
    console.error("Error while fetching students: " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const studentSingleFetch = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentModel.findById(id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Single Student Fetch Successfully",
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error while fetching single student : " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const studentAttendence = async (req, res) => {
  try {
    const { name, subject, time, present } = req.body;

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

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        success: false,
      });
    }

    // Check if the attendance for the same date already exists
    const isAttendanceExists = student.attendence.some(
      (entry) => entry.time === time
    );

    if (isAttendanceExists) {
      return res.status(400).json({
        message: "Attendance for today has already been recorded",
        success: false,
      });
    }

    let updatedStudent;

    if (time === todayDate) {
      updatedStudent = await StudentModel.findByIdAndUpdate(
        {
          _id: student._id,
        },
        {
          $push: {
            attendence: { time, present },
          },
        },
        { new: true }
      );
    } else {
      return res.status(400).json({
        message: "Attendence date is not today",
        success: false,
      });
    }

    res.status(200).json({
      message: "Attendance updated successfully",
      success: true,
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error while updating student attendence : " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const studentDelete = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedStudent = await StudentModel.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found in the database",
        success: false,
      });
    }
    res.status(200).json({
      message: "Student deleted successfully",
      success: true,
      data: deletedStudent,
    });
  } catch (error) {
    console.error("Error while deleting student : " + error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const studentAttendenceUpdate = async (req, res) => {
  const { id } = req.params;
  const { date, present } = req.body;

  try {
    const student = await StudentModel.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the attendance record for the given date exists
    const attendanceIndex = student.attendence.findIndex(
      (record) => record.time === date
    );

    if (attendanceIndex === -1) {
      return res.status(404).json({
        message: "Attendance record not found for the specified date",
      });
    }

    // Update the attendance status for the matched record
    student.attendence[attendanceIndex].present = present;

    // Save the updated student document
    await student.save();

    res
      .status(200)
      .json({ message: "Attendance updated successfully", student });
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export {
  studentFetch,
  studentAttendence,
  studentDelete,
  studentSingleFetch,
  studentAttendenceUpdate,
};
