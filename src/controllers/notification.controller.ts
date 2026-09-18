
import type { Request, Response } from "express";

import type {
  INotificationService,
} from "../interfaces/services/notification.service.interface";

export class NotificationController {
  constructor(
    private readonly notificationService: INotificationService
  ) {}

  getMyNotifications = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.user!.userId;

    const notifications =
      await this.notificationService.getMyNotifications(
        userId
      );

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  };

  getMyUnreadNotifications = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.user!.userId;

    const notifications =
      await this.notificationService.getMyUnreadNotifications(
        userId
      );

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  };

  markAsRead = async (
    req: Request<{ notificationId: string }>,
    res: Response
  ) => {
    const userId = req.user!.userId;

    const notification =
      await this.notificationService.markAsRead(
        userId,
        req.params.notificationId
      );

    return res.status(200).json({
      success: true,
      data: notification,
    });
  };

  markAllAsRead = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.user!.userId;

    const modifiedCount =
      await this.notificationService.markAllAsRead(
        userId
      );

    return res.status(200).json({
      success: true,
      data: {
        modifiedCount,
      },
    });
  };
}
