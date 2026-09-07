import { z } from "zod";

import { objectIdSchema } from "./object-id.validator";

export const categoryIdParamSchema =
  z.object({
    categoryId: objectIdSchema,
  });