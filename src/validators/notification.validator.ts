import { z } from "zod";

export const notificationIdParamsSchema = z.object({
  notificationId: z
    .string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid notification ID",
    ),
});