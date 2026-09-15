import { z } from "zod";

import { objectIdSchema } from "./object-id.validator";

export const assignmentIdParamSchema = z.object({
  assignmentId: objectIdSchema,
});
