import { Request, Response, NextFunction } from "express";

import { IEnrollmentService } from "../interfaces/services/enrollment.service.interface";

export class EnrollmentController {
  constructor(
    private readonly service: IEnrollmentService,
  ) {}

  enroll = async (
    req: Request <{ courseId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error("Authenticated user not found");
      }

      const enrollment = await this.service.enroll(
        req.params.courseId,
        req.user,
      );

      res.status(201).json({
        success: true,
        message: "Course enrolled successfully",
        data: enrollment,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyEnrollments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new Error("Authenticated user not found");
      }

      const enrollments =
        await this.service.getMyEnrollments(req.user);

      res.status(200).json({
        success: true,
        message: "Enrollments retrieved successfully",
        data: enrollments,
      });
    } catch (error) {
      next(error);
    }
  };
  async cancelEnrollment(
    req: Request<{ enrollmentId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = req.user!;

      const enrollment =
        await this.service.cancelEnrollment(
          req.params.enrollmentId,
          user,
        );

      res.status(200).json(enrollment);
    } catch (error) {
      next(error);
    }
  }
}


