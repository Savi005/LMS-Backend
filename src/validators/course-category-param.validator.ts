import { z } from "zod";

export const categoryIdParamSchema =
  z.object({
    categoryId: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid category ID"
      ),
  });