import { Types } from "mongoose";

export interface CreateCourseDto {
  title: string;
  description: string;
  categoryId: string;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string;
  categoryId?: string;
}

export interface CourseResponseDto {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  categoryId: string;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}