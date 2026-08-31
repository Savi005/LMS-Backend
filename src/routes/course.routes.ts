import { Router } from "express";

import { CourseController } from "../controllers/course.controller";

import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";

import {
  createCourseSchema,
  updateCourseSchema,
} from "../validators/course.validator";
import { courseIdParamSchema } from "../validators/course-param.validator";


import { CourseRepository } from "../repositories/course.repository";
import { CourseCategoryRepository } from "../repositories/course-category.repository";
import { CourseService } from "../services/course.service";


const router = Router();

const courseRepository = new CourseRepository();

const categoryRepository = new CourseCategoryRepository();

const courseService = new CourseService(courseRepository, categoryRepository);

const courseController = new CourseController(courseService);

router.post(
  "/",
  authenticate,
  authorize("teacher"),
  validate(createCourseSchema),
  courseController.createCourse,
);

router.get("/", authenticate, courseController.getCourses);

router.get(
  "/:courseId",
  authenticate,
  validate(courseIdParamSchema, "params"),
  courseController.getCourseById,
);
router.patch(
  "/:courseId/publish",
  authenticate,
  authorize("teacher"),
  validate(courseIdParamSchema, "params"),
  courseController.publishCourse
);

router.patch(
  "/:courseId",
  authenticate,
  authorize("teacher"),
  validate(courseIdParamSchema, "params"),
  validate(updateCourseSchema),
  courseController.updateCourse,
);

export default router;
