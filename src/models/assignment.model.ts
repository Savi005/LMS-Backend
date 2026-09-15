import {HydratedDocument,model,Schema, Types} from "mongoose";


export type AssignmentStatus = "draft" | "published";

export interface IAssignment {
    title: string;
    description: string;
    courseId: Types.ObjectId;
    status: AssignmentStatus;
    dueDate: Date;
    maxScore: number;
    createdAt: Date;
    updatedAt: Date;
}

export type AssignmentDocument = HydratedDocument<IAssignment>;

const assignmentSchema = new Schema<IAssignment>(
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
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
            required: true,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        maxScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    },
);

export const Assignment = model<IAssignment>(
    "Assignment",
    assignmentSchema,
);