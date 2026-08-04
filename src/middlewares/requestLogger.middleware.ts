import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.info({
    method: req.method,
    url: req.originalUrl,
  });

  next();
};