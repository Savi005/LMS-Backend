export interface CreateSubmissionDto {
  content: string;
}

export interface SubmissionResponseDto {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}