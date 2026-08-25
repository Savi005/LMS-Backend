import { Schema, model, HydratedDocument, Types } from "mongoose";

export interface IPasswordResetToken {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type PasswordResetTokenDocument =
    HydratedDocument<IPasswordResetToken>;

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true,
            expires: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const PasswordResetTokenModel = model<IPasswordResetToken>(
    "PasswordResetToken",
    PasswordResetTokenSchema
);