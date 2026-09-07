import { Schema, model, Types, HydratedDocument } from "mongoose";

export type EnrollmentStatus = "active" | "cancelled";

export interface IEnrollment {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  status: EnrollmentStatus;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type EnrollmentDocument = HydratedDocument<IEnrollment>;

const enrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
      required: true,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * A student can only have one enrollment
 * in a particular course.
 */
enrollmentSchema.index(
  { studentId: 1, courseId: 1 },
  { unique: true },
);

export const EnrollmentModel = model<IEnrollment>(
  "Enrollment",
  enrollmentSchema,
);