import os from "os";
import UserLog from "../models/UserLog.js";

const isLoopback = (ip) => {
  if (!ip) return true;
  if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") return true;
  if (ip.startsWith("::ffff:")) return true;
  if (ip.startsWith("127.")) return true;
  return false;
};

const isPrivate = (ip) => {
  if (!ip) return false;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  return false;
};

const getSystemIp = () => {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name] || []) {
        if (iface.family === "IPv4" && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch {
    // fall through
  }
  return "127.0.0.1";
};

const fetchGeoFromIp = async (ip) => {
  if (isLoopback(ip) || isPrivate(ip)) {
    return {
      city: "Private Network",
      region: "",
      country: "",
      lat: null,
      lon: null,
    };
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,country,lat,lon,status`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (data && data.status === "success") {
      return {
        city: data.city || "",
        region: data.regionName || "",
        country: data.country || "",
        lat: typeof data.lat === "number" ? data.lat : null,
        lon: typeof data.lon === "number" ? data.lon : null,
      };
    }
  } catch {
    // fall through to empty
  }
  return { city: "", region: "", country: "", lat: null, lon: null };
};

const reverseGeocode = async (lat, lon) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&accept-language=en`,
      {
        signal: controller.signal,
        headers: {
          "User-Agent": "GDCollege/1.0 (student-management-system)",
        },
      }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data?.address;
    if (!addr) return null;
    const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state_district || "";
    const region = addr.state || addr.region || addr.province || "";
    const country = addr.country || "";
    if (!city && !region && !country) return null;
    return { city, region, country };
  } catch {
    return null;
  }
};

export const createLog = async ({ userId, userType, userName, email = "", ip = "", userAgent = "", latitude, longitude }) => {
  try {
    const resolvedIp = isLoopback(ip) ? getSystemIp() : ip;
    const location = await fetchGeoFromIp(resolvedIp);
    const hasBrowserCoords =
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude);

    if (hasBrowserCoords) {
      location.lat = latitude;
      location.lon = longitude;
      if (!location.city || location.city === "Private Network") {
        const reverse = await reverseGeocode(latitude, longitude);
        if (reverse) {
          location.city = reverse.city || location.city;
          location.region = reverse.region || location.region;
          location.country = reverse.country || location.country;
        }
      }
    }

    await UserLog.create({
      userId: String(userId),
      userType,
      userName,
      email,
      ipAddress: resolvedIp,
      userAgent,
      location,
    });
  } catch (err) {
    console.error("UserLog create failed:", err?.message || err);
  }
};

export const getLogs = async ({ page = 1, limit = 50 } = {}) => {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(1000, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (safePage - 1) * safeLimit;

  const [logs, total] = await Promise.all([
    UserLog.find().sort({ createdAt: -1 }).skip(skip).limit(safeLimit).lean(),
    UserLog.countDocuments(),
  ]);

  return {
    logs,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

const toFiniteOrNull = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export const updateLog = async (id, data = {}) => {
  const update = {};

  if (typeof data.ipAddress === "string") update.ipAddress = data.ipAddress;
  if (typeof data.userAgent === "string") update.userAgent = data.userAgent;

  if (data.location && typeof data.location === "object") {
    const loc = {};
    if (typeof data.location.city === "string") loc.city = data.location.city;
    if (typeof data.location.region === "string") loc.region = data.location.region;
    if (typeof data.location.country === "string") loc.country = data.location.country;
    loc.lat = toFiniteOrNull(data.location.lat);
    loc.lon = toFiniteOrNull(data.location.lon);
    update.location = loc;
  }

  if (data.createdAt) {
    const d = new Date(data.createdAt);
    if (!isNaN(d.getTime())) update.createdAt = d;
  }

  const log = await UserLog.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
  if (!log) {
    const err = new Error("User log not found");
    err.statusCode = 404;
    throw err;
  }
  return log;
};

export const deleteLog = async (id) => {
  const log = await UserLog.findByIdAndDelete(id).lean();
  if (!log) {
    const err = new Error("User log not found");
    err.statusCode = 404;
    throw err;
  }
  return log;
};
