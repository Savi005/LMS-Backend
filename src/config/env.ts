import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.string(),
  MONGO_URI: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
});

const parsedEnv = envSchema.parse(process.env);

export const env = {
  port: parsedEnv.PORT,
  nodeEnv: parsedEnv.NODE_ENV,
  mongoUri: parsedEnv.MONGO_URI,
  jwtAccessSecret: parsedEnv.JWT_ACCESS_SECRET,
  jwtRefreshSecret: parsedEnv.JWT_REFRESH_SECRET,
};