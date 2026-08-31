import { z } from "zod";

export const createCourseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters"),

  categoryId: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid category ID"
    ),
});

export const updateCourseSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(150, "Title must not exceed 150 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description must not exceed 5000 characters")
      .optional(),

    categoryId: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid category ID"
      )
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided",
    }
  );
