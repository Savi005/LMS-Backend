import { Types } from "mongoose";

import { IEnrollmentService } from "../interfaces/services/enrollment.service.interface";
import { IEnrollmentRepository } from "../interfaces/repositories/enrollment.repository.interface";

import {
  EnrollmentResponseDto,
} from "../dtos/enrollment.dto";

import { ICourseRepository } from "../interfaces/repositories/course.repository.interface";

import { AuthenticatedUser } from "../types/authenticated-user";

// Use your project's existing error classes.
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { ConflictError } from "../errors/ConflictError";
import { EnrollmentDocument } from "../models/enrollment.model";

export class EnrollmentService implements IEnrollmentService {
  constructor(
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async enroll(
    courseId: string,
    user: AuthenticatedUser,
  ): Promise<EnrollmentResponseDto> {
    /**
     * Role authorization.
     *
     * Enrollment through this endpoint is a student operation.
     */
    if (user.role !== "student") {
      throw new ForbiddenError(
        "Only students can enroll in courses",
      );
    }

    /**
     * Validate the ObjectId at the service boundary as a
     * second layer of protection.
     *
     * Normally the API validator should already reject this.
     */
    if (!Types.ObjectId.isValid(courseId)) {
      throw new NotFoundError("Course not found");
    }

    /**
     * Verify the course exists.
     */
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    /**
     * Students can only enroll in published courses.
     */
    if (course.status !== "published") {
      throw new ConflictError(
        "Students can only enroll in published courses",
      );
    }

    /**
     * Prevent duplicate enrollment at the application level.
     */
    const existingEnrollment =
      await this.enrollmentRepository.findByStudentIdAndCourseId(
        user.userId,
        courseId,
      );

    if (existingEnrollment) {
      throw new ConflictError(
        "Student is already enrolled in this course",
      );
    }

    /**
     * Create the enrollment.
     *
     * studentId comes from authenticated user information,
     * NOT from the client request.
     */
    const enrollment =
      await this.enrollmentRepository.create({
        studentId: user.userId,
        courseId,
      });

    return this.toResponseDto(enrollment);
  }

  async getMyEnrollments(
    user: AuthenticatedUser,
  ): Promise<EnrollmentResponseDto[]> {
    if (user.role !== "student") {
      throw new ForbiddenError(
        "Only students can view their enrollments",
      );
    }

    const enrollments =
      await this.enrollmentRepository.findByStudentId(
        user.userId,
      );

    return enrollments.map((enrollment) =>
      this.toResponseDto(enrollment),
    );
  }
  async cancelEnrollment(
    enrollmentId: string,
    user: AuthenticatedUser,
  ): Promise<EnrollmentResponseDto> {
    const enrollment =
      await this.enrollmentRepository.findById(enrollmentId);

    if (!enrollment) {
      throw new NotFoundError("Enrollment not found");
    }

    /*
     * Admins can manage enrollment lifecycle.
     */
    if (user.role === "admin") {
      return this.cancel(enrollmentId, enrollment.status);
    }

    if (user.role !== "student") {
      throw new ForbiddenError(
        "You are not allowed to cancel this enrollment",
      );
    }

    if (enrollment.studentId.toString() !== user.userId) {
      throw new ForbiddenError(
        "You are not allowed to cancel this enrollment",
      );
    }

    return this.cancel(enrollmentId, enrollment.status);
  }

  private async cancel(
    enrollmentId: string,
    currentStatus: "active" | "cancelled",
  ): Promise<EnrollmentResponseDto> {
    if (currentStatus === "cancelled") {
      throw new ConflictError(
        "Enrollment is already cancelled",
      );
    }

    const updated =
      await this.enrollmentRepository.updateStatus(
        enrollmentId,
        "cancelled",
      );

    if (!updated) {
      throw new NotFoundError("Enrollment not found");
    }

    return this.toResponseDto(updated);
  }


  private toResponseDto(
    enrollment: EnrollmentDocument,
  ): EnrollmentResponseDto {
    return {
      id: enrollment._id.toString(),
      studentId: enrollment.studentId.toString(),
      courseId: enrollment.courseId.toString(),
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt,
      createdAt: enrollment.createdAt,
      updatedAt: enrollment.updatedAt,
    };
  }
}