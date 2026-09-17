import {
  ISubmission,
  Submission,
  SubmissionDocument,
} from "../models/submission.model";

import { ISubmissionRepository } from "../interfaces/repositories/submission.repository.interface";

export class SubmissionRepository
  implements ISubmissionRepository
{
  async create(
    data: Partial<ISubmission>,
  ): Promise<SubmissionDocument> {
    return Submission.create(data);
  }

  async findById(
    submissionId: string,
  ): Promise<SubmissionDocument | null> {
    return Submission.findById(submissionId);
  }

  async findByAssignmentAndStudent(
    assignmentId: string,
    studentId: string,
  ): Promise<SubmissionDocument | null> {
    return Submission.findOne({
      assignmentId,
      studentId,
    });
  }

  async findByAssignmentId(
    assignmentId: string,
  ): Promise<SubmissionDocument[]> {
    return Submission.find({
      assignmentId,
    }).sort({
      submittedAt: -1,
    });
  }

  async updateById(
    submissionId: string,
    data: Partial<ISubmission>,
  ): Promise<SubmissionDocument | null> {
    return Submission.findByIdAndUpdate(
      submissionId,
      data,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async upsert(
    assignmentId: string,
    studentId: string,
    data: Partial<ISubmission>,
  ): Promise<SubmissionDocument> {
    const submission =
      await Submission.findOneAndUpdate(
        {
          assignmentId,
          studentId,
        },
        {
          $set: data,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );

    return submission;
  }

 async gradeSubmission(
    submissionId:string,
    data:{
      score: number;
      feedback?: string;
      gradedBy: string;
      gradedAt: Date;
    }
){

    return Submission.findByIdAndUpdate(

        submissionId,

        {
           score: data.score,
           feedback: data.feedback,
           gradedBy: data.gradedBy,
           gradedAt: data.gradedAt
        },

        {
            new:true
        }

    );

}
}