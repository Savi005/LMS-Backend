import { Request, Response } from "express";

import { ISubmissionService } from "../interfaces/services/submission.service.interface";

export class SubmissionController {
  constructor(
    private readonly submissionService: ISubmissionService,
  ) {}

  submit = async (
    req: Request<{assignmentId: string}>,
    res: Response,
  ): Promise<void> => {
    const submission =
      await this.submissionService.submitAssignment(
        req.params.assignmentId,
        req.body,
        req.user!,
      );

    res.status(200).json({
      success: true,
      data: submission,
    });
  };

  getMySubmission = async (
    req: Request<{assignmentId: string}>,
    res: Response,
  ): Promise<void> => {
    const submission =
      await this.submissionService.getMySubmission(
        req.params.assignmentId,
        req.user!,
      );

    res.status(200).json({
      success: true,
      data: submission,
    });
  };

  getByAssignment = async (
    req: Request<{assignmentId: string}>,
    res: Response,
  ): Promise<void> => {
    const submissions =
      await this.submissionService.getSubmissionsByAssignment(
        req.params.assignmentId,
        req.user!,
      );

    res.status(200).json({
      success: true,
      data: submissions,
    });
  };
}
