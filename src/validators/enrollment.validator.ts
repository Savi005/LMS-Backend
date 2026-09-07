import { z } from "zod";

import { objectIdSchema } from "./object-id.validator";

export const enrollCourseParamsSchema = z.object({
  courseId: objectIdSchema,
});

export const enrollmentIdParamsSchema = z.object({
  enrollmentId: objectIdSchema,
});

export const courseIdParamsSchema = z.object({
  courseId: objectIdSchema,
});

export const myEnrollmentsParamsSchema = z.object({});