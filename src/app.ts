import express from "express";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import courseCategoryRoutes from "./routes/course-category.routes";
import lessonRoutes from "./routes/lesson.routes";
import assignmentRoutes from "./routes/assignments.routes";
import healthRoutes from "./routes/health.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { createEnrollmentRoutes } from "./routes/enrollment.routes";
import { EnrollmentController } from "./controllers/enrollment.controller";
import { EnrollmentService } from "./services/enrollment.service";
import { EnrollmentRepository } from "./repositories/enrollment.repository";
import { CourseRepository } from "./repositories/course.repository";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Initialize enrollment controller dependencies
const enrollmentRepository = new EnrollmentRepository();
const courseRepository = new CourseRepository();
const enrollmentService = new EnrollmentService(enrollmentRepository, courseRepository);
const enrollmentController = new EnrollmentController(enrollmentService);

app.use("/", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api", lessonRoutes);
app.use("/api", assignmentRoutes);
app.use("/api/course-categories", courseCategoryRoutes);
app.use("/api", createEnrollmentRoutes(enrollmentController));

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;