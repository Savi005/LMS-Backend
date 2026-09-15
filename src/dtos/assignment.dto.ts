import {AssignmentStatus} from "../models/assignment.model";

export interface CreateAssignmentDto {
    title: string;
    description: string;
    dueDate: Date;
    maxScore: number;
}

export interface UpdateAssignmentDto {
    title?: string;
    description?: string;
    dueDate?: Date;
    maxScore?: number;
}

export interface AssignmentResponseDto {
    id: string;
    title: string;
    description: string;
    courseId: string;
    status: AssignmentStatus;
    dueDate: Date;
    maxScore: number;
    createdAt: Date;
    updatedAt: Date;
}