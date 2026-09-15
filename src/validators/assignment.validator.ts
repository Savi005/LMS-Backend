import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description cannot exceed 5000 characters"),

  dueDate: z.coerce.date(),

  maxScore: z
    .number()
    .positive("Max score must be greater than 0")
    .max(100, "Max score cannot exceed 100"),
});

export const updateAssignmentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(200)
      .optional(),

    description: z
      .string()
      .trim()
      .min(1, "Description cannot be empty")
      .max(5000)
      .optional(),

    dueDate: z.coerce.date().optional(),

    maxScore: z
      .number()
      .positive("Max score must be greater than 0")
      .max(1000)
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });