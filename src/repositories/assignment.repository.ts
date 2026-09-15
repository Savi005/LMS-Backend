import {
  Assignment,
  AssignmentDocument,
  AssignmentStatus,
  IAssignment,
} from "../models/assignment.model";
import { IAssignmentRepository } from "../interfaces/repositories/assignment.repository.interface";

export class AssignmentRepository implements IAssignmentRepository {
  async create(
    data: Partial<IAssignment>,
  ): Promise<AssignmentDocument> {
    return Assignment.create(data);
  }

  async findById(
    assignmentId: string,
  ): Promise<AssignmentDocument | null> {
    return Assignment.findById(assignmentId);
  }

  async findByCourseId(
    courseId: string,
  ): Promise<AssignmentDocument[]> {
    return Assignment.find({ courseId }).sort({ dueDate: 1 });
  }

  async updateStatusIfCurrent(
    assignmentId: string,
    currentStatus: AssignmentStatus,
    newStatus: AssignmentStatus,
  ): Promise<AssignmentDocument | null> {
    return Assignment.findOneAndUpdate(
      { _id: assignmentId, status: currentStatus },
      { $set: { status: newStatus } },
      { new: true, runValidators: true },
    );
  }

  async updateById(
    assignmentId: string,
    data: Partial<IAssignment>,
  ): Promise<AssignmentDocument | null> {
    return Assignment.findByIdAndUpdate(
      assignmentId,
      data,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async updateStatus(
    assignmentId: string,
    status: AssignmentStatus,
  ): Promise<AssignmentDocument | null> {
    return Assignment.findByIdAndUpdate(
      assignmentId,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async deleteById(
    assignmentId: string,
  ): Promise<AssignmentDocument | null> {
    return Assignment.findByIdAndDelete(assignmentId);
  }
  async findByCourseIdAndStatus(
    courseId: string,
    status: AssignmentStatus,
  ): Promise<AssignmentDocument[]> {
    return Assignment.find({ courseId, status }).sort({ dueDate: 1 });
  }
}