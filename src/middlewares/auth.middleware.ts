import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ForbiddenError";
import { env } from "../config/env";
import { UserRole } from "../types/role";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const authHeader =
    req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {

    return next(
      new UnauthorizedError(
        "Authentication required"
      )
    );

  }

  const token =
    authHeader.split(" ")[1];

  try {

    const payload = jwt.verify(token, env.jwtAccessSecret) as {
      userId?: string;
      role?: string;
    };

    if (!payload.userId || !payload.role) {
      return next(new UnauthorizedError("Invalid token"));
    }

    req.user = {
      userId: payload.userId,
      role: payload.role as UserRole,
    };

    next();

  } catch {

    next(
      new UnauthorizedError(
        "Invalid token"
      )
    );

  }



;

};

export const authorize =
  (...roles: string[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ForbiddenError("Access denied"));
    }

    next();
  }