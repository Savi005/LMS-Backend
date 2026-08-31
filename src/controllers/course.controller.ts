import type { Request, Response } from "express";

import type {
  CourseService,
} from "../services/course.service";

export class CourseController {
  constructor(
    private readonly courseService: CourseService
  ) {}

  createCourse = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.user!.userId;

    const course =
      await this.courseService.createCourse(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      data: course,
    });
  };

  getCourses = async (
    req: Request,
    res: Response
  ) => {
    const userId = req.user!.userId;
    const role = req.user!.role;

    const courses =
      await this.courseService.getCourses(
        userId,
        role
      );

    return res.status(200).json({
      success: true,
      data: courses,
    });
  };

  getCourseById = async (
     req: Request<{ courseId: string }>,
    res: Response
  ) => {
    const userId = req.user!.userId;
    const role = req.user!.role;

    const course =
      await this.courseService.getCourseById(
        req.params.courseId,
        userId,
        role
      );

    return res.status(200).json({
      success: true,
      data: course,
    });
  };

  updateCourse = async (
     req: Request<{ courseId: string }>,
    res: Response
  ) => {
    const userId = req.user!.userId;

    const course =
      await this.courseService.updateCourse(
        req.params.courseId,
        userId,
        req.body
      );

    return res.status(200).json({
      success: true,
      data: course,
    });
  };
  publishCourse = async (
  req: Request<{ courseId: string }>,
  res: Response
) => {
  const userId = req.user!.userId;

  const course =
    await this.courseService.publishCourse(
      req.params.courseId,
      userId
    );

  return res.status(200).json({
    success: true,
    data: course,
  });
};
}

