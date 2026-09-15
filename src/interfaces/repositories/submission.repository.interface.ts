import {
  ISubmission,
  SubmissionDocument,
} from "../../models/submission.model";

export interface ISubmissionRepository {
  create(
    data: Partial<ISubmission>,
  ): Promise<SubmissionDocument>;

  findById(
    submissionId: string,
  ): Promise<SubmissionDocument | null>;

  findByAssignmentAndStudent(
    assignmentId: string,
    studentId: string,
  ): Promise<SubmissionDocument | null>;

  findByAssignmentId(
    assignmentId: string,
  ): Promise<SubmissionDocument[]>;

  updateById(
    submissionId: string,
    data: Partial<ISubmission>,
  ): Promise<SubmissionDocument | null>;
  
//update
  upsert(
    assignmentId: string,
    studentId: string,
    data: Partial<ISubmission>,
  ): Promise<SubmissionDocument>;
}//update