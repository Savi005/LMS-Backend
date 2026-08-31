import {
  Schema,
  model,
  type HydratedDocument,
} from "mongoose";

export interface ICourseCategory {
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CourseCategoryDocument =
  HydratedDocument<ICourseCategory>;

const courseCategorySchema =
  new Schema<ICourseCategory>(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

export const CourseCategory =
  model<ICourseCategory>(
    "CourseCategory",
    courseCategorySchema
  );
