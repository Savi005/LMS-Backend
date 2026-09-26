# LMS Backend

## Objective

This backend provides the LMS API for:

- User authentication and password management
- Courses, categories, and lessons
- Assignments, submissions, and grading
- Enrollments and notifications

## Architecture

The API uses Express, TypeScript, MongoDB, and Mongoose.

```text
routes -> controllers -> services -> repositories -> models
```

- `routes`: endpoints and middleware
- `controllers`: requests and responses
- `services`: business logic
- `repositories`: database operations
- `models`: Mongoose schemas
- `validators`: Zod request validation
- `middlewares`: auth, roles, validation, and errors

## Setup

The Dev Container uses Node 22 and starts MongoDB automatically. Open the repository in VS Code and run **Dev Containers: Reopen in Container**. MongoDB data is persisted in the Docker volume `mongodata`, so contributors do not need to install MongoDB locally.

From the backend directory:

```bash
cd /workspace/lms-backend
npm install
```

Create `.env`:

```dotenv
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://mongo:27017/lms_db
JWT_ACCESS_SECRET=change-me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change-me-too
JWT_REFRESH_EXPIRES_IN=7d
```

The `mongo` hostname is available from the backend container through Docker Compose. If you run the backend outside the Dev Container, use `mongodb://localhost:27017/lms_db` instead.

To start only the database manually, run `docker compose -f .devcontainer/docker-compose.yml up -d mongo` from the backend directory. Stop it with `docker compose -f .devcontainer/docker-compose.yml down`; add `-v` only when you want to delete the persisted database volume.

## Run and Build

```bash
npm run dev       # development server
npm run build     # compile to dist/
npm start         # run compiled server
npm test          # run tests
```

The API runs at `http://localhost:3000`.

## Postman

Use `http://localhost:3000` as the Postman base URL.

For protected requests, add:

```text
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Use a valid MongoDB ObjectId for values such as `:courseId`, `:assignmentId`, and `:categoryId`.

### Health and Authentication

| Method | Endpoint | Body |
| --- | --- | --- |
| GET | `/health` | None |
| POST | `/api/auth/register` | `{ "name": "Jane", "email": "jane@example.com", "password": "password123", "role": "student" }` |
| POST | `/api/auth/login` | `{ "email": "jane@example.com", "password": "password123" }` |
| POST | `/api/auth/refresh` | `{ "refreshToken": "..." }` |
| POST | `/api/auth/logout` | `{ "refreshToken": "..." }` |
| POST | `/api/auth/change-password` | `{ "currentPassword": "password123", "newPassword": "newpassword123" }` |
| POST | `/api/auth/forgot-password` | `{ "email": "jane@example.com" }` |
| POST | `/api/auth/reset-password` | `{ "token": "...", "newPassword": "newpassword123" }` |

### Courses and Categories

| Method | Endpoint | Body |
| --- | --- | --- |
| POST | `/api/course-categories` | `{ "name": "Programming", "description": "Programming courses" }` (admin) |
| GET | `/api/course-categories` | None |
| PATCH | `/api/course-categories/:categoryId` | `{ "name": "Software Development" }` (admin) |
| DELETE | `/api/course-categories/:categoryId` | None (admin) |
| POST | `/api/courses` | `{ "title": "TypeScript Basics", "description": "Learn TypeScript fundamentals", "categoryId": "..." }` (teacher) |
| GET | `/api/courses` | None |
| GET | `/api/courses/:courseId` | None |
| PATCH | `/api/courses/:courseId` | `{ "title": "Advanced TypeScript" }` (teacher) |
| PATCH | `/api/courses/:courseId/publish` | None (teacher) |

### Lessons and Assignments

| Method | Endpoint | Body |
| --- | --- | --- |
| POST | `/api/courses/:courseId/lessons` | `{ "title": "Introduction", "description": "Getting started", "content": "Lesson content", "order": 1 }` (teacher/admin) |
| GET | `/api/courses/:courseId/lessons` | None |
| GET | `/api/lessons/:lessonId` | None |
| PATCH | `/api/lessons/:lessonId` | `{ "content": "Updated lesson content" }` (teacher/admin) |
| DELETE | `/api/lessons/:lessonId` | None (teacher/admin) |
| POST | `/api/courses/:courseId/assignments` | `{ "title": "First task", "description": "Complete the task", "dueDate": "2026-12-31", "maxScore": 100 }` (teacher) |
| GET | `/api/courses/:courseId/assignments` | None |
| GET | `/api/assignments/:assignmentId` | None |
| PATCH | `/api/assignments/:assignmentId` | `{ "maxScore": 50 }` (teacher) |
| DELETE | `/api/assignments/:assignmentId` | None (teacher) |
| PATCH | `/api/assignments/:assignmentId/publish` | None |
| PATCH | `/api/assignments/:assignmentId/unpublish` | None |

### Enrollments and Submissions

| Method | Endpoint | Body |
| --- | --- | --- |
| POST | `/api/courses/:courseId/enroll` | None |
| GET | `/api/enrollments/me` | None |
| DELETE | `/api/enrollments/:enrollmentId` | None |
| POST | `/api/assignments/:assignmentId/submissions` | `{ "content": "My submitted answer" }` |
| GET | `/api/assignments/:assignmentId/submissions/me` | None |
| GET | `/api/assignments/:assignmentId/submissions` | None |
| PATCH | `/api/submissions/:submissionId/grade` | `{ "score": 85, "feedback": "Good work" }` |

### Notifications

| Method | Endpoint | Body |
| --- | --- | --- |
| GET | `/api/notifications` | None |
| GET | `/api/notifications/unread` | None |
| PATCH | `/api/notifications/:notificationId/read` | None |
| PATCH | `/api/notifications/read-all` | None |

## Deployment

```bash
npm ci
npm run build
npm start
```

Set the required environment variables in the hosting platform, provide a reachable MongoDB database, expose the configured `PORT`, and verify `GET /health` in Postman.
