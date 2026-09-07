import { z } from "zod";

import { objectIdSchema } from "./object-id.validator";

export const courseIdParamSchema = z.object({
  courseId: objectIdSchema,
});

export const lessonIdParamSchema = z.object({
  lessonId: objectIdSchema,
});

export const createLessonSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),

  content: z
    .string()
    .trim()
    .min(1, "Content is required"),

  order: z
    .number()
    .int()
    .positive()
    .optional(),
});

export const updateLessonSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .optional(),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    content: z
      .string()
      .trim()
      .min(1)
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    },
  );