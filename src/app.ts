import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import courseCategoryRoutes from "./routes/course-category.routes";

import healthRoutes from "./routes/health.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use(errorHandler);
app.use(
  "/course-categories",
  courseCategoryRoutes
);
export default app;