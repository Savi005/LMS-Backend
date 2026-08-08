import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ForbiddenError";

export const authenticate = (
  req: any,
  res: any,
  next: any
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

    const payload =
      jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET!
      );

    req.user = payload;

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
    if (!roles.includes((req as any).user.role)) {
      return next(
        new ForbiddenError("Access denied")
      );
    }

    next();
  }