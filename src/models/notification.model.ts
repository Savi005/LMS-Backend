import { HydratedDocument, model, Schema, Types } from "mongoose";

export const NotificatinType = {
    SUBMISSION_GRADED: "SUBMISSION_GRADED",
} as const;

export type NotificationType =
    typeof NotificatinType[keyof typeof NotificatinType];

export interface Notification {
    recipientId: Types.ObjectId;
    type: NotificationType;
    title: string;
    message: string;
    readAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export type NotificationDocument = HydratedDocument<Notification>;

const notificationSchema = new Schema<NotificationDocument>(
    {
        recipientId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: Object.values(NotificatinType),
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },

        readAt: {
            type: Date,
            default: null,
        },
    },

    {
        timestamps: true,
    }
);

notificationSchema.index({
  recipientId: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipientId: 1,
  readAt: 1,
  createdAt: -1,
});

export const NotificationModel = model<NotificationDocument>(
    "Notification",
    notificationSchema
);