import { Router } from "express";

import { CourseCategoryController } from "../controllers/course-category.controller";
import { CourseCategoryService } from "../services/course-category.service";
import { CourseCategoryRepository } from "../repositories/course-category.repository";
import { CourseRepository } from "../repositories/course.repository";

import { authenticate, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";

import {
  createCourseCategorySchema,
  updateCourseCategorySchema,
} from "../validators/course-category.validator";

import {
  categoryIdParamSchema,
} from "../validators/course-category-param.validator";

const router = Router();

// Initialize dependencies
const categoryRepository = new CourseCategoryRepository();
const courseRepository = new CourseRepository();
const categoryService = new CourseCategoryService(categoryRepository, courseRepository);
const categoryController = new CourseCategoryController(categoryService);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCourseCategorySchema),
  categoryController.createCategory
);

router.get(
  "/",
  authenticate,
  categoryController.getCategories
);

router.patch(
  "/:categoryId",
  authenticate,
  authorize("admin"),
  validate(categoryIdParamSchema, "params"),
  validate(updateCourseCategorySchema),
  categoryController.updateCategory
);

router.delete(
  "/:categoryId",
  authenticate,
  authorize("admin"),
  validate(categoryIdParamSchema, "params"),
  categoryController.deleteCategory
);

export default router;