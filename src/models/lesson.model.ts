import { Schema, model, Types, HydratedDocument } from "mongoose";

export interface ILesson {
  title: string;
  description?: string;
  content: string;
  courseId: Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type LessonDocument = HydratedDocument<ILesson>;

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
);

lessonSchema.index(
  { courseId: 1, order: 1 },
  { unique: true },
);

export const Lesson = model<ILesson>("Lesson", lessonSchema);