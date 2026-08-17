import { Router } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { validate } from "../middlewares/validate";
import { UserRepository } from "../repositories/user.repository";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { refreshTokenSchema } from "../validators/auth.validator";

const router=Router();

const repository=new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();

const service=new AuthService(repository, refreshTokenRepository);

const controller=new AuthController(service);

router.post(

"/register",

validate(registerSchema),

controller.register

);

router.post(

"/login",

validate(loginSchema),

controller.login

);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  controller.refresh.bind(controller)
);



export default router;