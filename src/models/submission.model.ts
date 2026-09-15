import { HydratedDocument, model, Schema, Types } from "mongoose";

export interface ISubmission {
  studentId: Types.ObjectId;
  assignmentId: Types.ObjectId;
  content: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SubmissionDocument = HydratedDocument<ISubmission>;

const submissionSchema = new Schema<ISubmission>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 20000,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);
submissionSchema.index(
  {
    assignmentId: 1,
    studentId: 1,
  },
  {
    unique: true,
  },
);

export const Submission = model<ISubmission>("Submission", submissionSchema);
