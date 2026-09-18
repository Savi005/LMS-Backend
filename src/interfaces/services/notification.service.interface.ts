import {
  CreateNotificationDto,
  NotificationResponseDto,
} from "../../dtos/notification.dto";

export interface INotificationService {
  createNotification(
    data: CreateNotificationDto,
  ): Promise<NotificationResponseDto>;

  getMyNotifications(
    userId: string,
  ): Promise<NotificationResponseDto[]>;

  getMyUnreadNotifications(
    userId: string,
  ): Promise<NotificationResponseDto[]>;

  markAsRead(
    userId: string,
    notificationId: string,
  ): Promise<NotificationResponseDto>;

  markAllAsRead(
    userId: string,
  ): Promise<number>;
}