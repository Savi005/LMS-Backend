import { Router } from "express";

import {
  SubmissionController,
} from "../controllers/submission.controller";

import {
  authenticate,
} from "../middlewares/auth.middleware";

import { validate } from "../middlewares/validate";

import {
  createSubmissionSchema,
  gradeSubmissionSchema,
} from "../validators/submission.validator";

export const createSubmissionRoutes = (
  submissionController: SubmissionController,
): Router => {
  const router = Router();

  /*
   * Student submit / resubmit.
   */
  router.post(
    "/assignments/:assignmentId/submissions",
    authenticate,
    validate(createSubmissionSchema),
    submissionController.submit,
  );

  /*
   * Student views own submission.
   */
  router.get(
    "/assignments/:assignmentId/submissions/me",
    authenticate,
    submissionController.getMySubmission,
  );

  /*
   * Teacher/admin views submissions
   * for an assignment.
   */
  router.get(
    "/assignments/:assignmentId/submissions",
    authenticate,
    submissionController.getByAssignment,
  );

  router.patch(
    "/submissions/:submissionId/grade",
    authenticate,
    validate(gradeSubmissionSchema),
    submissionController.grade,
  );

  return router;

};