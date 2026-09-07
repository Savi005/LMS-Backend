import {
  EnrollmentResponseDto,
} from "../../dtos/enrollment.dto";

import { AuthenticatedUser } from "../../types/authenticated-user";

export interface IEnrollmentService {
  enroll(
    courseId: string,
    user: AuthenticatedUser,
  ): Promise<EnrollmentResponseDto>;

  getMyEnrollments(
    user: AuthenticatedUser,
  ): Promise<EnrollmentResponseDto[]>;
  
  cancelEnrollment(
    enrollmentId: string,
    user: AuthenticatedUser,
  ): Promise<EnrollmentResponseDto>;
}