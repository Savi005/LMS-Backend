import { EnrollmentStatus } from "../models/enrollment.model";


export interface EnrollmentResponseDto {
  id: string;
  studentId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
