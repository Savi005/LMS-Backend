import {
  CreateNotificationDto,
  NotificationResponseDto,
} from "../dtos/notification.dto";

import { NotFoundError } from "../errors/NotFoundError";

import {
  INotificationRepository,
} from "../interfaces/repositories/notification.repository.interface";

import {
  INotificationService,
} from "../interfaces/services/notification.service.interface";
import { NotificationDocument } from "../models/notification.model";

export class NotificationService
  implements INotificationService
{
  constructor(
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async createNotification(
    data: CreateNotificationDto,
  ): Promise<NotificationResponseDto> {
    const notification =
      await this.notificationRepository.create(data);

    return this.toResponse(notification);
  }

  async getMyNotifications(
    userId: string,
  ): Promise<NotificationResponseDto[]> {
    const notifications =
      await this.notificationRepository.findByRecipient(userId);

    return notifications.map((notification) =>
      this.toResponse(notification),
    );
  }

  async getMyUnreadNotifications(
    userId: string,
  ): Promise<NotificationResponseDto[]> {
    const notifications =
      await this.notificationRepository.findUnreadByRecipient(
        userId,
      );

    return notifications.map((notification) =>
      this.toResponse(notification),
    );
  }

  async markAsRead(
    userId: string,
    notificationId: string,
  ): Promise<NotificationResponseDto> {
    const notification =
      await this.notificationRepository.markAsRead(
        notificationId,
        userId,
      );

    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    return this.toResponse(notification);
  }

  async markAllAsRead(
    userId: string,
  ): Promise<number> {
    return this.notificationRepository.markAllAsRead(userId);
  }

  private toResponse(
    notification: NotificationDocument,
  ): NotificationResponseDto {
    return {
      id: notification._id.toString(),
      recipientId: notification.recipientId.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }
}