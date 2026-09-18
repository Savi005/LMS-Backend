import { Router } from "express";

import {
  NotificationController,
} from "../controllers/notification.controller";

import {
  authenticate,
} from "../middlewares/auth.middleware";

import { validate } from "../middlewares/validate";

import {
  notificationIdParamsSchema,
} from "../validators/notification.validator";

export const createNotificationRoutes = (
  notificationController: NotificationController,
): Router => {

  const router = Router();

  /**
   * User views all notifications.
   */
  router.get(
    "/",
    authenticate,
    notificationController.getMyNotifications,
  );

  /**
   * User views unread notifications.
   */
  router.get(
    "/unread",
    authenticate,
    notificationController.getMyUnreadNotifications,
  );

  /**
   * User marks one notification as read.
   */
  router.patch(
    "/:notificationId/read",
    authenticate,
    validate(notificationIdParamsSchema),
    notificationController.markAsRead,
  );

  /**
   * User marks all notifications as read.
   */
  router.patch(
    "/read-all",
    authenticate,
    notificationController.markAllAsRead,
  );

  return router;
};

