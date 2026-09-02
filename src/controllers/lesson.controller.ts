import type { Request, Response } from "express";

import type {
  LessonService,
} from "../services/lesson.service";

export class LessonController {
  constructor(
    private readonly lessonService: LessonService
  ) {}

  createLesson = async (
    req: Request<{ courseId: string }>,
    res: Response
  ) => {
    const userId = req.user!.userId;
    const role = req.user!.role;

    const lesson = await this.lessonService.createLesson(
      req.params.courseId,
      req.body,
      { userId, role }
    );

    return res.status(201).json({
      success: true,
      data: lesson,
    });
  };

  getLessonsByCourse = async (
    req: Request<{ courseId: string }>,
    res: Response
  ) => {
    const userId = req.user!.userId;
    const role = req.user!.role;

    const lessons =
      await this.lessonService.getLessonsByCourse(
        req.params.courseId,
        { userId, role }
      );

    return res.status(200).json({
      success: true,
      data: lessons,
    });
  };

  getLesson = async (
    req: Request<{ lessonId: string }>,
    res: Response
  ) => {
    const userId = req.user!.userId;
    const role = req.user!.role;

    const lesson = await this.lessonService.getLesson(
      req.params.lessonId,
      { userId, role }
    );

    return res.status(200).json({
      success: true,
      data: lesson,
    });
  };

  updateLesson = async (
    req: Request<{ lessonId: string }>,
    res: Response
  ) => {
    const userId = req.user!.userId;
    const role = req.user!.role;

    const lesson = await this.lessonService.updateLesson(
      req.params.lessonId,
      req.body,
      { userId, role }
    );

    return res.status(200).json({
      success: true,
      data: lesson,
    });
  };

  deleteLesson = async (
    req: Request<{ lessonId: string }>,
    res: Response
  ) => {
    const userId = req.user!.userId;
    const role = req.user!.role;

    await this.lessonService.deleteLesson(
      req.params.lessonId,
      { userId, role }
    );

    return res.status(204).send();
  };
}