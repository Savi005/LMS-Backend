import { Router } from "express";
import { AppError } from "../errors/AppError";

const router = Router();

router.get("/", () => {
  throw new AppError(
    "This is a test error",
    400
  );
});

export default router;