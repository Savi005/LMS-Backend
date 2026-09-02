import { Types } from "mongoose";
import {
  ILesson,
} from "../../models/lesson.model";
import {
  CreateLessonDto,
  UpdateLessonDto,
} from "../../dtos/lesson.dto";

export interface ILessonRepository {
  create(
    data: CreateLessonDto & {
      courseId: Types.ObjectId;
      order: number;
    },
  ): Promise<ILesson>;

  findById(
    lessonId: string,
  ): Promise<ILesson | null>;

  findByCourseId(
    courseId: string,
  ): Promise<ILesson[]>;

  update(
    lessonId: string,
    data: UpdateLessonDto,
  ): Promise<ILesson | null>;

  delete(
    lessonId: string,
  ): Promise<ILesson | null>;

  getMaxOrder(
    courseId: string,
  ): Promise<number>;

  existsByCourseIdAndOrder(
    courseId: string,
    order: number,
  ): Promise<boolean>;
}