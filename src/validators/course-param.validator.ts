import { z } from "zod";

import { objectIdSchema } from "./object-id.validator";

export const courseIdParamSchema = z.object({
  courseId: objectIdSchema,
});