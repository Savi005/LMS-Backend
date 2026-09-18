
import {
  CreateSubmissionDto,
  SubmissionResponseDto,
} from "../dtos/submission.dto";

import {
  SubmissionDocument,
} from "../models/submission.model";

import {
  ISubmissionService,
} from "../interfaces/services/submission.service.interface";

import {
  ISubmissionRepository,
} from "../interfaces/repositories/submission.repository.interface";

import {
  IAssignmentRepository,
} from "../interfaces/repositories/assignment.repository.interface";

import {
  ICourseRepository,
} from "../interfaces/repositories/course.repository.interface";

import {
  IEnrollmentRepository,
} from "../interfaces/repositories/enrollment.repository.interface";

import { AuthenticatedUser } from "../types/authenticated-user";

import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFoundError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { ValidationError } from "../errors/ValidationError";

import { logger } from "../config/logger";

import { UserRole } from "../types/role";

import { GradeSubmissionDto } from "../dtos/grade-submission.dto";

import {
  INotificationService,
} from "../interfaces/services/notification.service.interface";

import {
  NotificationType,
} from "../models/notification.model";

export class SubmissionService
  implements ISubmissionService
{
  constructor(
    private readonly submissionRepository: ISubmissionRepository,
    private readonly assignmentRepository: IAssignmentRepository,
    private readonly courseRepository: ICourseRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async submitAssignment(
    assignmentId: string,
    data: CreateSubmissionDto,
    user: AuthenticatedUser,
  ): Promise<SubmissionResponseDto> {

    this.ensureStudent(user);

    const assignment =
      await this.assignmentRepository.findById(
        assignmentId,
      );

    if (!assignment) {
      throw new NotFoundError(
        "Assignment not found",
      );
    }

    /**
     * Students can only submit to published
     * assignments.
     */
    if (assignment.status !== "published") {
      throw new NotFoundError(
        "Assignment not found",
      );
    }

    const course =
      await this.courseRepository.findById(
        assignment.courseId.toString(),
      );

    if (!course) {
      throw new NotFoundError(
        "Course not found",
      );
    }

    /**
     * Course must also be published.
     */
    if (course.status !== "published") {
      throw new ForbiddenError(
        "Course is not available",
      );
    }

    /**
     * Student must have an active enrollment.
     */
    const enrollment =
      await this.enrollmentRepository
        .findByStudentIdAndCourseId(
          user.userId,
          assignment.courseId.toString(),
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

    /**
     * MVP rule:
     * submissions after the deadline are rejected.
     */
    if (
      Date.now() >= assignment.dueDate.getTime()
    ) {
      throw new ConflictError(
        "The assignment submission deadline has passed",
      );
    }

    const existingSubmission =
      await this.submissionRepository
        .findByAssignmentAndStudent(
          assignmentId,
          user.userId,
        );

    const submission =
      await this.submissionRepository.upsert(
        assignmentId,
        user.userId,
        {
          content: data.content,
          submittedAt: new Date(),
        },
      );

    logger.info(
      {
        submissionId: submission._id.toString(),
        assignmentId,
        studentId: user.userId,
        action: existingSubmission
          ? "resubmit"
          : "submit",
      },
      existingSubmission
        ? "Assignment resubmitted"
        : "Assignment submitted",
    );

    return this.toResponseDto(submission);
  }

  async getMySubmission(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<SubmissionResponseDto> {

    this.ensureStudent(user);

    const assignment =
      await this.assignmentRepository.findById(
        assignmentId,
      );

    if (!assignment) {
      throw new NotFoundError(
        "Assignment not found",
      );
    }

    if (assignment.status !== "published") {
      throw new NotFoundError(
        "Assignment not found",
      );
    }

    const course =
      await this.courseRepository.findById(
        assignment.courseId.toString(),
      );

    if (!course) {
      throw new NotFoundError(
        "Course not found",
      );
    }

    if (course.status !== "published") {
      throw new ForbiddenError(
        "Course is not available",
      );
    }

    await this.ensureActiveEnrollment(
      assignment.courseId.toString(),
      user,
    );

    const submission =
      await this.submissionRepository
        .findByAssignmentAndStudent(
          assignmentId,
          user.userId,
        );

    if (!submission) {
      throw new NotFoundError(
        "Submission not found",
      );
    }

    return this.toResponseDto(submission);
  }

  async getSubmissionsByAssignment(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<SubmissionResponseDto[]> {

    this.ensureTeacherOrAdmin(user);

    const assignment =
      await this.assignmentRepository.findById(
        assignmentId,
      );

    if (!assignment) {
      throw new NotFoundError(
        "Assignment not found",
      );
    }

    const course =
      await this.courseRepository.findById(
        assignment.courseId.toString(),
      );

    if (!course) {
      throw new NotFoundError(
        "Course not found",
      );
    }

    /**
     * Admin bypasses ownership.
     */
    if (user.role !== "admin") {
      if (
        course.teacherId.toString() !==
        user.userId
      ) {
        throw new ForbiddenError(
          "You do not have permission to view these submissions",
        );
      }
    }

    const submissions =
      await this.submissionRepository
        .findByAssignmentId(
          assignmentId,
        );

    return submissions.map((submission) =>
      this.toResponseDto(submission),
    );
  }

  async gradeSubmission(
    userId: string,
    role: UserRole,
    submissionId: string,
    data: GradeSubmissionDto,
  ): Promise<SubmissionResponseDto> {

    /**
     * Only teachers and admins can grade.
     */
    if (
      role !== "teacher" &&
      role !== "admin"
    ) {
      throw new ForbiddenError(
        "Only teachers or admins can grade submissions",
      );
    }

    const submission =
      await this.submissionRepository
        .findById(submissionId);

    if (!submission) {
      throw new NotFoundError(
        "Submission not found",
      );
    }

    const assignment =
      await this.assignmentRepository
        .findById(
          submission.assignmentId.toString(),
        );

    if (!assignment) {
      throw new NotFoundError(
        "Assignment not found",
      );
    }

    const course =
      await this.courseRepository
        .findById(
          assignment.courseId.toString(),
        );

    if (!course) {
      throw new NotFoundError(
        "Course not found",
      );
    }

    /**
     * Teacher can only grade submissions
     * from their own course.
     *
     * Admin bypasses ownership.
     */
    if (
      role === "teacher" &&
      course.teacherId.toString() !== userId
    ) {
      throw new ForbiddenError(
        "You cannot grade submissions from this course",
      );
    }

    /**
     * Score cannot exceed assignment maximum.
     */
    if (
      data.score > assignment.maxScore
    ) {
      throw new ValidationError(
        "Score cannot exceed maximum score",
      );
    }

    const updatedSubmission =
      await this.submissionRepository
        .gradeSubmission(
          submissionId,
          {
            score: data.score,
            feedback: data.feedback,
            gradedBy: userId,
            gradedAt: new Date(),
          },
        );

    if (!updatedSubmission) {
      throw new NotFoundError(
        "Submission not found",
      );
    }

    /**
     * Notify the student after successful grading.
     *
     * Notification failure should not undo
     * the successful grading operation.
     */
    try {
      await this.notificationService.createNotification({
        recipientId:
          submission.studentId.toString(),
        type: "SUBMISSION_GRADED",
        title: "Assignment graded",
        message: "Your assignment has been graded.",
      });
    } catch (error) {
      logger.error(
        {
          submissionId,
          studentId:
            submission.studentId.toString(),
          error,
        },
        "Failed to create grading notification",
      );
    }

    return this.toResponseDto(
      updatedSubmission,
    );
  }

  private ensureStudent(
    user: AuthenticatedUser,
  ): void {

    if (user.role !== "student") {
      throw new ForbiddenError(
        "Only students can submit assignments",
      );
    }
  }

  private ensureTeacherOrAdmin(
    user: AuthenticatedUser,
  ): void {

    if (
      user.role !== "teacher" &&
      user.role !== "admin"
    ) {
      throw new ForbiddenError(
        "You do not have permission to view submissions",
      );
    }
  }

  private async ensureActiveEnrollment(
    courseId: string,
    user: AuthenticatedUser,
  ): Promise<void> {

    const enrollment =
      await this.enrollmentRepository
        .findByStudentIdAndCourseId(
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

  private toResponseDto(
    submission: SubmissionDocument,
  ): SubmissionResponseDto {

    return {
      id: submission._id.toString(),

      assignmentId:
        submission.assignmentId.toString(),

      studentId:
        submission.studentId.toString(),

      content: submission.content,

      submittedAt:
        submission.submittedAt,

      createdAt:
        submission.createdAt,

      updatedAt:
        submission.updatedAt,
    };
  }
}

