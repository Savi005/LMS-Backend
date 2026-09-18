import {
  NotificationDocument,
  NotificationType,
} from "../../models/notification.model";

export interface INotificationRepository {
  create(
    data: {
      recipientId: string;
      type: NotificationType;
      title: string;
      message: string;
    },
  ): Promise<NotificationDocument>;

  findById(
    notificationId: string,
  ): Promise<NotificationDocument | null>;

  findByRecipient(
    recipientId: string,
  ): Promise<NotificationDocument[]>;

  findUnreadByRecipient(
    recipientId: string,
  ): Promise<NotificationDocument[]>;

  markAsRead(
    notificationId: string,
    recipientId: string,
  ): Promise<NotificationDocument | null>;

  markAllAsRead(
    recipientId: string,
  ): Promise<number>;
}