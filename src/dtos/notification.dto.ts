import { NotificationType } from "../models/notification.model";

export interface CreateNotificationDto {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
}

export interface NotificationResponseDto {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}