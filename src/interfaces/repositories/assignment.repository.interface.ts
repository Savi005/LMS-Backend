import {
  AssignmentDocument,
  AssignmentStatus,
  IAssignment,
} from "../../models/assignment.model";

export interface IAssignmentRepository {
  create(
    data: Partial<IAssignment>,
  ): Promise<AssignmentDocument>;

  findById(
    assignmentId: string,
  ): Promise<AssignmentDocument | null>;

  findByCourseId(
    courseId: string,
  ): Promise<AssignmentDocument[]>;

  updateById(
    assignmentId: string,
    data: Partial<IAssignment>,
  ): Promise<AssignmentDocument | null>;

  updateStatus(
    assignmentId: string,
    status: AssignmentStatus,
  ): Promise<AssignmentDocument | null>;
  updateStatusIfCurrent(
  assignmentId: string,
  currentStatus: AssignmentStatus,
  newStatus: AssignmentStatus,
): Promise<AssignmentDocument | null>;

  deleteById(
    assignmentId: string,
  ): Promise<AssignmentDocument | null>;

  findByCourseIdAndStatus(
    courseId: string,
    status: AssignmentStatus,
  ): Promise<AssignmentDocument[]>;
}