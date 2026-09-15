import { Types } from "mongoose";

import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentResponseDto,
} from "../dtos/assignment.dto";

import { IAssignmentRepository } from "../interfaces/repositories/assignment.repository.interface";
import { ICourseRepository } from "../interfaces/repositories/course.repository.interface";
import { IEnrollmentRepository } from "../interfaces/repositories/enrollment.repository.interface";

import { IAssignmentService } from "../interfaces/services/assignment.service.interface";

import { AuthenticatedUser } from "../types/authenticated-user";

import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";

import { AssignmentDocument } from "../models/assignment.model";

import { logger } from "../config/logger";

export class AssignmentService implements IAssignmentService {
  constructor(
    private readonly assignmentRepository: IAssignmentRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  // --------------------------------------------------
  // CREATE ASSIGNMENT
  // --------------------------------------------------

  async createAssignment(
    courseId: string,
    data: CreateAssignmentDto,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto> {
    this.ensureTeacherOrAdmin(user);

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    this.ensureCourseOwnership(course, user);

    const assignment = await this.assignmentRepository.create({
      title: data.title,
      description: data.description,
      courseId: new Types.ObjectId(courseId),
      dueDate: data.dueDate,
      maxScore: data.maxScore,
      status: "draft",
    });

    logger.info(
      {
        assignmentId: assignment._id,
        courseId,
        userId: user.userId,
      },
      "Assignment created",
    );

    return this.toResponseDto(assignment);
  }

  // --------------------------------------------------
  // GET ASSIGNMENTS BY COURSE
  // --------------------------------------------------

  async getAssignmentsByCourse(
    courseId: string,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto[]> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    // Admin can see everything
    if (user.role === "admin") {
      const assignments =
        await this.assignmentRepository.findByCourseId(courseId);

      return assignments.map((assignment) =>
        this.toResponseDto(assignment),
      );
    }

    // Teacher can see assignments of their own course
    if (user.role === "teacher") {
      this.ensureCourseOwnership(course, user);

      const assignments =
        await this.assignmentRepository.findByCourseId(courseId);

      return assignments.map((assignment) =>
        this.toResponseDto(assignment),
      );
    }

    // Student can only see published assignments
    await this.ensureStudentCanAccessCourse(
      courseId,
      course.status,
      user,
    );

    const assignments =
      await this.assignmentRepository.findByCourseIdAndStatus(
        courseId,
        "published"
      );

    return assignments.map((assignment) =>
      this.toResponseDto(assignment),
    );
  }

  // --------------------------------------------------
  // GET ASSIGNMENT BY ID
  // --------------------------------------------------

  async getAssignment(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto> {
    const assignment =
      await this.assignmentRepository.findById(
        assignmentId,
      );

    if (!assignment) {
      throw new NotFoundError("Assignment not found");
    }

    const course = await this.courseRepository.findById(
      assignment.courseId.toString(),
    );

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    // Admin
    if (user.role === "admin") {
      return this.toResponseDto(assignment);
    }

    // Teacher
    if (user.role === "teacher") {
      this.ensureCourseOwnership(course, user);

      return this.toResponseDto(assignment);
    }

    // Student
    await this.ensureStudentCanAccessCourse(
      assignment.courseId.toString(),
      course.status,
      user,
    );

    if (assignment.status !== "published") {
      throw new NotFoundError("Assignment not found");
    }

    return this.toResponseDto(assignment);
  }

  // --------------------------------------------------
  // UPDATE ASSIGNMENT
  // --------------------------------------------------

  async updateAssignment(
    assignmentId: string,
    data: UpdateAssignmentDto,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto> {
    this.ensureTeacherOrAdmin(user);

    const assignment =
      await this.assignmentRepository.findById(
        assignmentId,
      );

    if (!assignment) {
      throw new NotFoundError("Assignment not found");
    }

    const course = await this.courseRepository.findById(
      assignment.courseId.toString(),
    );

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    this.ensureCourseOwnership(course, user);

    // Published assignment cannot be given a past due date
    if (
      assignment.status === "published" &&
      data.dueDate &&
      data.dueDate.getTime() <= Date.now()
    ) {
      throw new ConflictError(
        "A published assignment cannot have a past due date",
      );
    }

    const updatedAssignment =
      await this.assignmentRepository.updateById(
        assignmentId,
        data,
      );

    if (!updatedAssignment) {
      throw new NotFoundError("Assignment not found");
    }

    logger.info(
      {
        assignmentId,
        userId: user.userId,
      },
      "Assignment updated",
    );

    return this.toResponseDto(updatedAssignment);
  }

  // --------------------------------------------------
  // DELETE ASSIGNMENT
  // --------------------------------------------------

  async deleteAssignment(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    this.ensureTeacherOrAdmin(user);

    const assignment =
      await this.assignmentRepository.findById(
        assignmentId,
      );

    if (!assignment) {
      throw new NotFoundError("Assignment not found");
    }

    const course = await this.courseRepository.findById(
      assignment.courseId.toString(),
    );

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    this.ensureCourseOwnership(course, user);

    await this.assignmentRepository.deleteById(assignmentId);

    logger.info(
      {
        assignmentId,
        userId: user.userId,
      },
      "Assignment deleted",
    );
  }

  // --------------------------------------------------
  // PUBLISH ASSIGNMENT
  // --------------------------------------------------

  async publishAssignment(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto> {
    this.ensureTeacherOrAdmin(user);

    const assignment =
      await this.assignmentRepository.findById(
        assignmentId,
      );

    if (!assignment) {
      throw new NotFoundError("Assignment not found");
    }

    const course = await this.courseRepository.findById(
      assignment.courseId.toString(),
    );

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    this.ensureCourseOwnership(course, user);

    if (assignment.status === "published") {
      throw new ConflictError(
        "Assignment is already published",
      );
    }

    if (course.status !== "published") {
      throw new ConflictError(
        "Course must be published before publishing assignments",
      );
    }

    if (assignment.dueDate.getTime() <= Date.now()) {
      throw new ConflictError(
        "Assignment due date must be in the future",
      );
    }

const updatedAssignment =
  await this.assignmentRepository.updateStatusIfCurrent(
    assignmentId,
    "draft",
    "published",
  );

if (!updatedAssignment) {
  throw new ConflictError(
    "Assignment is no longer in draft state",
  );
}

    logger.info(
      {
        assignmentId,
        userId: user.userId,
      },
      "Assignment published",
    );

    return this.toResponseDto(updatedAssignment);
  }

  // --------------------------------------------------
  // UNPUBLISH ASSIGNMENT
  // --------------------------------------------------

  async unpublishAssignment(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto> {
    this.ensureTeacherOrAdmin(user);

    const assignment =
      await this.assignmentRepository.findById(
        assignmentId,
      );

    if (!assignment) {
      throw new NotFoundError("Assignment not found");
    }

    const course = await this.courseRepository.findById(
      assignment.courseId.toString(),
    );

    if (!course) {
      throw new NotFoundError("Course not found");
    }

    this.ensureCourseOwnership(course, user);

    if (assignment.status === "draft") {
      throw new ConflictError(
        "Assignment is already in draft status",
      );
    }

    const updatedAssignment =
  await this.assignmentRepository.updateStatusIfCurrent(
    assignmentId,
    "published",
    "draft",
  );

if (!updatedAssignment) {
  throw new ConflictError(
    "Assignment is no longer published",
  );
}


    logger.info(
      {
        assignmentId,
        userId: user.userId,
      },
      "Assignment unpublished",
    );

    return this.toResponseDto(updatedAssignment);
  }

  // --------------------------------------------------
  // ENSURE TEACHER OR ADMIN
  // --------------------------------------------------

  private ensureTeacherOrAdmin(
    user: AuthenticatedUser,
  ): void {
    if (
      user.role !== "teacher" &&
      user.role !== "admin"
    ) {
      throw new ForbiddenError(
        "Only teachers and admins can perform this action",
      );
    }
  }

  // --------------------------------------------------
  // ENSURE COURSE OWNERSHIP
  // --------------------------------------------------

  private ensureCourseOwnership(
    course: {
      teacherId: Types.ObjectId;
    },
    user: AuthenticatedUser,
  ): void {
    // Admin can access any course
    if (user.role === "admin") {
      return;
    }

    if (
      user.role === "teacher" &&
      course.teacherId.toString() !== user.userId
    ) {
      throw new ForbiddenError(
        "You do not have access to this course",
      );
    }
  }

  // --------------------------------------------------
  // ENSURE STUDENT CAN ACCESS COURSE
  // --------------------------------------------------

  private async ensureStudentCanAccessCourse(
    courseId: string,
    courseStatus: "draft" | "published",
    user: AuthenticatedUser,
  ): Promise<void> {
    if (user.role !== "student") {
      return;
    }

    if (courseStatus !== "published") {
      throw new ForbiddenError(
        "Course is not available",
      );
    }

    const enrollment =
      await this.enrollmentRepository.findByStudentIdAndCourseId(
        user.userId,
        courseId,
      );

    if (!enrollment) {
      throw new ForbiddenError(
        "You are not enrolled in this course",
      );
    }

    if (enrollment.status !== "active") {
      throw new ForbiddenError(
        "Your enrollment is not active",
      );
    }
  }

  // --------------------------------------------------
  // RESPONSE DTO
  // --------------------------------------------------

  private toResponseDto(
    assignment: AssignmentDocument,
  ): AssignmentResponseDto {
    return {
      id: assignment._id.toString(),
      title: assignment.title,
      description: assignment.description,
      courseId: assignment.courseId.toString(),
      dueDate: assignment.dueDate,
      maxScore: assignment.maxScore,
      status: assignment.status,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    };
  }
}

