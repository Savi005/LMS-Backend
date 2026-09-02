import {
  CreateLessonDto,
  UpdateLessonDto,
  ResponseLessonDto,
} from "../../dtos/lesson.dto";

import { AuthenticatedUser } from "../../services/lesson.service";

export interface ILessonService {
  createLesson(
    courseId: string,
    data: CreateLessonDto,
    user: AuthenticatedUser,
  ): Promise<ResponseLessonDto>;

  getLessonsByCourse(
    courseId: string,
    user: AuthenticatedUser,
  ): Promise<ResponseLessonDto[]>;

  getLesson(
    lessonId: string,
    user: AuthenticatedUser,
  ): Promise<ResponseLessonDto>;

  updateLesson(
    lessonId: string,
    data: UpdateLessonDto,
    user: AuthenticatedUser,
  ): Promise<ResponseLessonDto>;

  deleteLesson(
    lessonId: string,
    user: AuthenticatedUser,
  ): Promise<void>;
}