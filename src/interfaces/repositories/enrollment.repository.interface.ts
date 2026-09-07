import { EnrollmentDocument, EnrollmentStatus } from "../../models/enrollment.model";

export interface IEnrollmentRepository {
  create(data: {
    studentId: string;
    courseId: string;
  }): Promise<EnrollmentDocument>;
  
  findByStudentIdAndCourseId(
    studentId: string,
    courseId: string,
  ): Promise<EnrollmentDocument | null>;

  findByStudentId(studentId: string): Promise<EnrollmentDocument[]>;

  findById(id: string): Promise<EnrollmentDocument | null>;

  updateStatus(
    id: string,
    status: EnrollmentStatus,
  ): Promise<EnrollmentDocument | null>;
}
