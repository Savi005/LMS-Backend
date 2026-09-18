import {
  INotificationRepository,
} from "../interfaces/repositories/notification.repository.interface";

import {
  NotificationDocument,
  NotificationModel,
  NotificationType,
} from "../models/notification.model";

export class NotificationRepository
  implements INotificationRepository
{
  async create(data: {
    recipientId: string;
    type: NotificationType;
    title: string;
    message: string;
  }): Promise<NotificationDocument> {
    return NotificationModel.create(data);
  }

  async findById(
    notificationId: string,
  ): Promise<NotificationDocument | null> {
    return NotificationModel.findById(notificationId);
  }

  async findByRecipient(
    recipientId: string,
  ): Promise<NotificationDocument[]> {
    return NotificationModel.find({
      recipientId,
    }).sort({
      createdAt: -1,
    });
  }

  async findUnreadByRecipient(
    recipientId: string,
  ): Promise<NotificationDocument[]> {
    return NotificationModel.find({
      recipientId,
      readAt: null,
    }).sort({
      createdAt: -1,
    });
  }

  async markAsRead(
    notificationId: string,
    recipientId: string,
  ): Promise<NotificationDocument | null> {
    return NotificationModel.findOneAndUpdate(
      {
        _id: notificationId,
        recipientId,
      },
      {
        $set: {
          readAt: new Date(),
        },
      },
      {
        new: true,
      },
    );
  }

  async markAllAsRead(
    recipientId: string,
  ): Promise<number> {
    const result = await NotificationModel.updateMany(
      {
        recipientId,
        readAt: null,
      },
      {
        $set: {
          readAt: new Date(),
        },
      },
    );

    return result.modifiedCount;
  }
}