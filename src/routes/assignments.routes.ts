import { Router } from "express";

import { AssignmentController } from "../controllers/assignment.controller";

import { authenticate, authorize } from "../middlewares/auth.middleware";

import { validate } from "../middlewares/validate";

import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from "../validators/assignment.validator";
import { assignmentIdParamSchema } from "../validators/assignment-param.validator";

import { AssignmentRepository } from "../repositories/assignment.repository";
import { CourseRepository } from "../repositories/course.repository";
import { EnrollmentRepository } from "../repositories/enrollment.repository";

import { AssignmentService } from "../services/assignment.service";

const router = Router();

const assignmentRepository = new AssignmentRepository();
const courseRepository = new CourseRepository();
const enrollmentRepository = new EnrollmentRepository();

const assignmentService = new AssignmentService(
  assignmentRepository,
  courseRepository,
  enrollmentRepository,
);

const assignmentController = new AssignmentController(
  assignmentService,
);

router.post(
  "/courses/:courseId/assignments",
  authenticate,
  authorize("teacher"),
  validate(createAssignmentSchema),
  assignmentController.create,
);

router.get(
  "/courses/:courseId/assignments",
  authenticate,
  assignmentController.getByCourse,
);

router.get(
  "/assignments/:assignmentId",
  authenticate,
  validate(assignmentIdParamSchema, "params"),
  assignmentController.getById,
);

router.patch(
  "/assignments/:assignmentId",
  authenticate,
  authorize("teacher"),
  validate(assignmentIdParamSchema, "params"),
  validate(updateAssignmentSchema),
  assignmentController.update,
);

router.delete(
  "/assignments/:assignmentId",
  authenticate,
  authorize("teacher"),
  validate(assignmentIdParamSchema, "params"),
  assignmentController.delete,
);
router.patch(
  "/assignments/:assignmentId/publish",
  authenticate,
  validate(assignmentIdParamSchema, "params"),
  assignmentController.publish,
);

router.patch(
  "/assignments/:assignmentId/unpublish",
  authenticate,
  validate(assignmentIdParamSchema, "params"),
  assignmentController.unpublish,
);

export default router;
