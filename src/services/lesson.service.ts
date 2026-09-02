import { Types } from "mongoose";

import type {
  CreateLessonDto,
  UpdateLessonDto,
  ResponseLessonDto,
} from "../dtos/lesson.dto";

import type { ILessonRepository } from "../interfaces/repositories/lesson.repository.interface";

import type { ICourseRepository } from "../interfaces/repositories/course.repository.interface";

import type { ILessonService } from "../interfaces/services/lesson.service.interface";

import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { ConflictError } from "../errors/ConflictError";

export interface AuthenticatedUser {
  userId: string;
  role: string;
}

export class LessonService implements ILessonService {
  constructor(
    private readonly lessonRepository: ILessonRepository,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async createLesson(
    courseId: string,
    data: CreateLessonDto,
    user: AuthenticatedUser,
  ): Promise<ResponseLessonDto> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    this.assertCanManageCourse(course, user);

    let order = data.order;

    if (order === undefined) {
      const maxOrder =
        await this.lessonRepository.getMaxOrder(courseId);

      order = maxOrder + 1;
    }

    const orderExists =
      await this.lessonRepository.existsByCourseIdAndOrder(
        courseId,
        order,
      );

    if (orderExists) {
      throw new ConflictError(
        "A lesson already exists at this order",
      );
    }

    try {
      const lesson =
        await this.lessonRepository.create({
          ...data,
          courseId: new Types.ObjectId(courseId),
          order,
        });

      return this.toResponseDTO(lesson);
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictError(
          "A lesson already exists at this order",
        );
      }

      throw error;
    }
  }

  async getLessonsByCourse(
    courseId: string,
    user: AuthenticatedUser,
  ): Promise<ResponseLessonDto[]> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    this.assertCanViewCourse(course, user);

    const lessons =
      await this.lessonRepository.findByCourseId(courseId);

    return lessons.map((lesson) =>
      this.toResponseDTO(lesson),
    );
  }

  async getLesson(
    lessonId: string,
    user: AuthenticatedUser,
  ): Promise<ResponseLessonDto> {
    const lesson =
      await this.lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new NotFoundError("Lesson not found");
    }

    const course =
      await this.courseRepository.findById(
        lesson.courseId.toString(),
      );

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    this.assertCanViewCourse(course, user);

    return this.toResponseDTO(lesson);
  }

  async updateLesson(
    lessonId: string,
    data: UpdateLessonDto,
    user: AuthenticatedUser,
  ): Promise<ResponseLessonDto> {
    const lesson =
      await this.lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new NotFoundError("Lesson not found");
    }

    const course =
      await this.courseRepository.findById(
        lesson.courseId.toString(),
      );

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    this.assertCanManageCourse(course, user);

    const updated =
      await this.lessonRepository.update(
        lessonId,
        data,
      );

    if (!updated) {
      throw new NotFoundError("Lesson not found");
    }

    return this.toResponseDTO(updated);
  }

  async deleteLesson(
    lessonId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    const lesson =
      await this.lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new NotFoundError("Lesson not found");
    }

    const course =
      await this.courseRepository.findById(
        lesson.courseId.toString(),
      );

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    this.assertCanManageCourse(course, user);

    const deleted =
      await this.lessonRepository.delete(lessonId);

    if (!deleted) {
      throw new NotFoundError("Lesson not found");
    }
  }

  private assertCanManageCourse(
    course: any,
    user: AuthenticatedUser,
  ): void {
    if (user.role === "admin") {
      return;
    }

    if (user.role !== "teacher") {
      throw new ForbiddenError(
        "You are not allowed to manage lessons",
      );
    }

    if (
      course.teacherId.toString() !== user.userId
    ) {
      throw new ForbiddenError(
        "You do not own this course",
      );
    }
  }

  private assertCanViewCourse(
    course: any,
    user: AuthenticatedUser,
  ): void {
    if (user.role === "admin") {
      return;
    }

    if (
      user.role === "teacher" &&
      course.teacherId.toString() === user.userId
    ) {
      return;
    }

    if (course.status !== "published") {
      throw new ForbiddenError(
        "This course is not available",
      );
    }
  }

  private toResponseDTO(
    lesson: any,
  ): ResponseLessonDto {
    return {
      id: lesson._id.toString(),
      title: lesson.title,
      description: lesson.description,
      content: lesson.content,
      courseId: lesson.courseId.toString(),
      order: lesson.order,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}