import {
  CourseResponseDto,
  CreateCourseDto,
  UpdateCourseDto,
} from "/workspace/lms-backend/src/dtos/course.dto";

import type { UserRole } from "../../types/role";

export interface ICourseService {
  createCourse(
    teacherId: string,
    data: CreateCourseDto,
  ): Promise<CourseResponseDto>;

  getCourse(userId: string, role: UserRole): Promise<CourseResponseDto>;

  getCourseById(
    courseId: string,
    userId: string,
    role: UserRole,
  ): Promise<CourseResponseDto>;

  updateCourse(
    userId: string,
    role: UserRole,
    courseId: string,
    data: UpdateCourseDto,
  ): Promise<CourseResponseDto>;
  
  publishCourse(courseId: string, userId: string): Promise<CourseResponseDto>;
}
