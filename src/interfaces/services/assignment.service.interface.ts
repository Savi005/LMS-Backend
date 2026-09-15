import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  AssignmentResponseDto,
} from "../../dtos/assignment.dto";
import { AuthenticatedUser } from "../../types/authenticated-user";

export interface IAssignmentService {
  createAssignment(
    courseId: string,
    data: CreateAssignmentDto,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto>;

  getAssignmentsByCourse(
    courseId: string,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto[]>;

  getAssignment(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto>;

  updateAssignment(
    assignmentId: string,
    data: UpdateAssignmentDto,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto>;

  deleteAssignment(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<void>;
  
    publishAssignment(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto>;

  unpublishAssignment(
    assignmentId: string,
    user: AuthenticatedUser,
  ): Promise<AssignmentResponseDto>;
}