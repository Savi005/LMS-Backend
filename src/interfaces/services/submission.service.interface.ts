import {
  CreateSubmissionDto,
  SubmissionResponseDto,
} from "../../dtos/submission.dto";

import { AuthenticatedUser } from "../../types/authenticated-user";

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
}