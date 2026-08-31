import { Schema, Types, model, type HydratedDocument } from "mongoose";

export interface ICourse {
  title: string;
  description: string;
  teacherId: Types.ObjectId;
  categoryId: Types.ObjectId;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

export type CourseDocument = HydratedDocument<ICourse>;

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    teacherId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },

    categoryId: {
      type: Types.ObjectId,
      required: true,
      ref: "Category",
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      required: true,
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.index({ teacherId: 1 });
courseSchema.index({ categoryId: 1 });
courseSchema.index({ status: 1 });

export const Course = model<ICourse>("Course", courseSchema);