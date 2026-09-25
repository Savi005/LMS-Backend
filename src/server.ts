import http from "http";
import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { initializeSocketServer } from "./sockets/socket.server";

const startServer = async () => {
  const httpServer = http.createServer(app);

  initializeSocketServer(httpServer);

  try {
    await connectDatabase();

    httpServer.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to start server");
    process.exit(1);
  }
};

void startServer();
