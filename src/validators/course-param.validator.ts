import { z } from "zod";

export const courseIdParamSchema = z.object({
  courseId: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid course ID"
    ),
});