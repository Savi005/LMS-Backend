import { GradeSubmissionDto } from "../../dtos/grade-submission.dto";
import {
  CreateSubmissionDto,
  SubmissionResponseDto,
} from "../../dtos/submission.dto";

import { AuthenticatedUser } from "../../types/authenticated-user";
import { UserRole } from "../../types/role";

export interface ISubmissionService {
  submitAssignment(
    assignmentId: string,
    data: CreateSubmissionDto,
    user: AuthenticatedUser,
  ): Promise<SubmissionResponseDto>;

  getMySubmission(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<SubmissionResponseDto>;

  getSubmissionsByAssignment(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<SubmissionResponseDto[]>;
  gradeSubmission(
    teacherId:string,
    role:UserRole,
    submissionId:string,
    data:GradeSubmissionDto
):Promise<SubmissionResponseDto>;
}