    import { z } from "zod";

export const createSubmissionSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Submission content is required")
    .max(
      20000,
      "Submission content cannot exceed 20000 characters",
    ),
});

export const gradeSubmissionSchema = z.object({
  score: z
        .number()
        .min(0),
  feedback: z
    .string()
    .trim()
    .max(2000, "Feedback cannot exceed 2000 characters")
    .optional(),
});