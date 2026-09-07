import {
  EnrollmentDocument,
  EnrollmentModel,
  EnrollmentStatus,
} from "../models/enrollment.model";
import { IEnrollmentRepository } from "../interfaces/repositories/enrollment.repository.interface";

export class EnrollmentRepository implements IEnrollmentRepository {
  async create(data: {
    studentId: string;
    courseId: string;
  }): Promise<EnrollmentDocument> {
    return EnrollmentModel.create({
      studentId: data.studentId,
      courseId: data.courseId,
    });
  }

  async findByStudentIdAndCourseId(
    studentId: string,
    courseId: string,
  ): Promise<EnrollmentDocument | null> {
    return EnrollmentModel.findOne({
      studentId,
      courseId,
    });
  }

  async findByStudentId(
    studentId: string,
  ): Promise<EnrollmentDocument[]> {
    return EnrollmentModel.find({
      studentId,
    }).sort({ enrolledAt: -1 });
  }

  async findById(
    enrollmentId: string,
  ): Promise<EnrollmentDocument | null> {
    return EnrollmentModel.findById(enrollmentId);
  }
  async updateStatus(
    enrollmentId: string,
    status: EnrollmentStatus,
  ): Promise<EnrollmentDocument | null> {
    return EnrollmentModel.findByIdAndUpdate(
      enrollmentId,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
      },
    );
  }
}