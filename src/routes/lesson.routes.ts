import { Router } from "express";

import { LessonController } from "../controllers/lesson.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { CourseRepository } from "../repositories/course.repository";
import { LessonRepository } from "../repositories/lesson.repository";
import { LessonService } from "../services/lesson.service";

import {
  courseIdParamSchema,
  lessonIdParamSchema,
  createLessonSchema,
  updateLessonSchema,
} from "../validators/lesson.validator";

export const createLessonRoutes = (
  lessonController: LessonController,
): Router => {
  const router = Router();

  router.post(
    "/courses/:courseId/lessons",
    authenticate,
    authorize("teacher", "admin"),
    validate(courseIdParamSchema, "params"),
    validate(createLessonSchema, "body"),
    lessonController.createLesson,
  );

  router.get(
    "/courses/:courseId/lessons",
    authenticate,
    validate(courseIdParamSchema, "params"),
    lessonController.getLessonsByCourse,
  );

  router.get(
    "/lessons/:lessonId",
    authenticate,
    validate(lessonIdParamSchema, "params"),
    lessonController.getLesson,
  );

  router.patch(
    "/lessons/:lessonId",
    authenticate,
    authorize("teacher", "admin"),
    validate(lessonIdParamSchema, "params"),
    validate(updateLessonSchema, "body"),
    lessonController.updateLesson,
  );

  router.delete(
    "/lessons/:lessonId",
    authenticate,
    authorize("teacher", "admin"),
    validate(lessonIdParamSchema, "params"),
    lessonController.deleteLesson,
  );

  return router;
};

const lessonRepository = new LessonRepository();
const courseRepository = new CourseRepository();
const lessonService = new LessonService(
  lessonRepository,
  courseRepository,
);
const lessonController = new LessonController(lessonService);

export default createLessonRoutes(lessonController);