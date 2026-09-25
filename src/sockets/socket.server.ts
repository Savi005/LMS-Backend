import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { logger } from "../config/logger";

export const initializeSocketServer = (
  httpServer: HttpServer,
): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    logger.info(
      { socketId: socket.id },
      "Socket connected",
    );

    socket.on("disconnect", (reason) => {
      logger.info(
        {
          socketId: socket.id,
          reason,
        },
        "Socket disconnected",
      );
    });
  });

  return io;
};