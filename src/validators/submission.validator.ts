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