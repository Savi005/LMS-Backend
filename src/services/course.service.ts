import { Types } from "mongoose";

import type {
  CreateCourseDto,
  UpdateCourseDto,
  CourseResponseDto,
} from "../dtos/course.dto";
import type { UserRole } from "../types/role";

import type {
  ICourseRepository,
} from "../interfaces/repositories/course.repository.interface";

import type {
  ICourseCategoryRepository,
} from "../interfaces/repositories/course-category.repository.interface";

import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import type {
  CourseDocument,
} from "../models/course.model";
import { ConflictError } from "../errors/ConflictError";

export class CourseService {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly categoryRepository: ICourseCategoryRepository
  ) {}

  async createCourse(
    userId: string,
    data: CreateCourseDto
  ): Promise<CourseResponseDto> {
    const category =
      await this.categoryRepository.findById(
        data.categoryId
      );

    if (!category) {
      throw new NotFoundError(
        "Course category not found"
      );
    }

    const course =
      await this.courseRepository.create({
        title: data.title,
        description: data.description,
        teacherId: new Types.ObjectId(userId),
        categoryId: new Types.ObjectId(data.categoryId),
        status: "draft",
      });

    return this.toResponseDto(course);
  }

  async getCourses(
    userId: string,
    role: UserRole
  ): Promise<CourseResponseDto[]> {
    let courses;

    if (role === "admin") {
      courses =
        await this.courseRepository.findAll();
    } else if (role === "teacher") {
      courses =
        await this.courseRepository.findByTeacherId(
          userId
        );
    } else {
      courses =
        await this.courseRepository.findPublished();
    }

    return courses.map((course) =>
      this.toResponseDto(course)
    );
  }

  async getCourseById(
    courseId: string,
    userId: string,
    role: UserRole
  ): Promise<CourseResponseDto> {
    const course =
      await this.courseRepository.findById(
        courseId
      );

    if (!course) {
      throw new NotFoundError(
        "Course not found"
      );
    }

    const isOwner =
      course.teacherId.toString() === userId;

    const isPublished =
      course.status === "published";

    const isAdmin =
      role === "admin";

    if (
      !isPublished &&
      !isOwner &&
      !isAdmin
    ) {
      throw new ForbiddenError(
        "You are not allowed to view this course"
      );
    }

    return this.toResponseDto(course);
  }

  async updateCourse(
    courseId: string,
    userId: string,
    data: UpdateCourseDto
  ): Promise<CourseResponseDto> {
    const course =
      await this.courseRepository.findById(
        courseId
      );

    if (!course) {
      throw new NotFoundError(
        "Course not found"
      );
    }

    const isOwner =
      course.teacherId.toString() === userId;

    if (!isOwner) {
      throw new ForbiddenError(
        "You are not allowed to modify this course"
      );
    }

    if (data.categoryId) {
      const category =
        await this.categoryRepository.findById(
          data.categoryId
        );

      if (!category) {
        throw new NotFoundError(
          "Course category not found"
        );
      }
    }

    const updatedCourse =
      await this.courseRepository.updateById(
        courseId,
        {
          ...(data.title !== undefined && {
            title: data.title,
          }),

          ...(data.description !== undefined && {
            description: data.description,
          }),

          ...(data.categoryId !== undefined && {
            categoryId: new Types.ObjectId(
              data.categoryId
            ),
          }),
        }
      );

    if (!updatedCourse) {
      throw new NotFoundError(
        "Course not found"
      );
    }

    return this.toResponseDto(
      updatedCourse
    );
  }
  async publishCourse(
  courseId: string,
  userId: string
): Promise<CourseResponseDto> {
  const course =
    await this.courseRepository.findById(
      courseId
    );

  if (!course) {
    throw new NotFoundError(
      "Course not found"
    );
  }

  const isOwner =
    course.teacherId.toString() === userId;

  if (!isOwner) {
    throw new ForbiddenError(
      "You are not allowed to publish this course"
    );
  }

  if (course.status === "published") {
    throw new ConflictError(
      "Course is already published"
    );
  }

  if (!course.title.trim()) {
    throw new ConflictError(
      "Course title is required before publishing"
    );
  }

  if (!course.description.trim()) {
    throw new ConflictError(
      "Course description is required before publishing"
    );
  }

  const publishedCourse =
    await this.courseRepository.publish(
      courseId
    );

  if (!publishedCourse) {
    throw new ConflictError(
      "Course could not be published"
    );
  }

  return this.toResponseDto(
    publishedCourse
  );
}

  private toResponseDto(
  course: CourseDocument
): CourseResponseDto {
  return {
    id: course._id.toString(),
    title: course.title,
    description: course.description,
    teacherId: course.teacherId.toString(),
    categoryId: course.categoryId.toString(),
    status: course.status,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
}
}