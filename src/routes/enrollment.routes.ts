import { Router } from "express";

import { EnrollmentController } from "../controllers/enrollment.controller";

import { authenticate} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";

import {
  enrollCourseParamsSchema,
  enrollmentIdParamsSchema,
} from "../validators/enrollment.validator";

export const createEnrollmentRoutes = (
  enrollmentController: EnrollmentController,
): Router => {
  const router = Router();

  router.post(
    "/courses/:courseId/enroll",
    authenticate,
    validate(enrollCourseParamsSchema, "params"),
    enrollmentController.enroll,
  );

  router.get(
    "/enrollments/me",
    authenticate,
    enrollmentController.getMyEnrollments,
  );
   router.delete(
    "/enrollments/:enrollmentId",
    authenticate,
   validate(enrollmentIdParamsSchema, "params"),
    enrollmentController.cancelEnrollment.bind(
      enrollmentController,
    ),
  );

  return router;
};