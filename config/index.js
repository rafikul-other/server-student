import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoUrl: process.env.MONGO_URL,
  secretKey: process.env.SECRET_KEY || "asdakdjb2387462387basdkahb871263^&%^$##",
  superAdmin: {
    id: process.env.SUPER_ADMIN_ID,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },
  admin: {
    id: process.env.ADMIN_ID,
    password: process.env.ADMIN_PASSWORD,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
};

export default config;