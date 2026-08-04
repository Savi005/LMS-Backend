import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri);

    logger.info("Database connected");
  } catch (error) {
    logger.error("Database connection failed");

    process.exit(1);
  }
};