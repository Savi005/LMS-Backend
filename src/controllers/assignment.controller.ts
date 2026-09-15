import type { Request, Response } from "express";
import type { IAssignmentService } from "../interfaces/services/assignment.service.interface";

export class AssignmentController {
  constructor(
    private readonly assignmentService: IAssignmentService,
  ) {}

  create = async (req: Request, res: Response) => {
    const assignment = await this.assignmentService.createAssignment(
      req.params.courseId as string,
      req.body,
      req.user!,
    );

    return res.status(201).json({
      success: true,
      data: assignment,
    });
  };

  getByCourse = async (req: Request, res: Response) => {
    const assignments =
      await this.assignmentService.getAssignmentsByCourse(
        req.params.courseId as string,
        req.user!,
      );

    return res.status(200).json({
      success: true,
      data: assignments,
    });
  };

  getById = async (req: Request, res: Response) => {
    const assignment = await this.assignmentService.getAssignment(
      req.params.assignmentId as string,
      req.user!,
    );

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  };

  update = async (req: Request, res: Response) => {
    const assignment = await this.assignmentService.updateAssignment(
      req.params.assignmentId as string,
      req.body,
      req.user!,
    );

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  };

  delete = async (req: Request, res: Response) => {
    await this.assignmentService.deleteAssignment(
      req.params.assignmentId as string,
      req.user!,
    );

    return res.status(204).send();
  };

  publish = async (req: Request, res: Response) => {
    const assignment = await this.assignmentService.publishAssignment(
      req.params.assignmentId as string,
      req.user!,
    );

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  };

  unpublish = async (req: Request, res: Response) => {
    const assignment = await this.assignmentService.unpublishAssignment(
      req.params.assignmentId as string,
      req.user!,
    );

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  };
}

