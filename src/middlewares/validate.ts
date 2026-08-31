import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../errors/ValidationError";

export const validate =
  (schema: ZodSchema, source: "body" | "params" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const value = source === "params" ? req.params : req.body;
    const result = schema.safeParse(value);

    if (!result.success) {
      return next(
        new ValidationError(result.error.issues[0].message)
      );
    }

    if (source === "params") {
      req.params = result.data as Request["params"];
    } else {
      req.body = result.data;
    }

    next();
  };