import { z } from "zod";

export const createCourseCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
});

export const updateCourseCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name must not exceed 100 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Description must not exceed 500 characters")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  );