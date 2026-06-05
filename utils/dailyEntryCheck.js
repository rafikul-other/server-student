import Student from "../models/Student.js";
import DepartmentManager from "../models/DepartmentManager.js";
import config from "../config/index.js";

export const getTodayStartEnd = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
  return {
    start: startOfDay,
    end: endOfDay,
    startStr: startOfDay.toISOString(),
    endStr: endOfDay.toISOString(),
  };
};

export const checkDailyLimit = async () => {
  const { start, end } = getTodayStartEnd();

  const studentCount = await Student.countDocuments({
    createdAt: { $gte: start, $lt: end },
  });

  const managerCount = await DepartmentManager.countDocuments({
    createdAt: { $gte: start, $lt: end },
  });

  const total = studentCount + managerCount;
  const limit = config.dailyEntryLimit;
  const allowed = total < limit;

  return {
    allowed,
    count: total,
    limit,
    remaining: Math.max(0, limit - total),
  };
};
