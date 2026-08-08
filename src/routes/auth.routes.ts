import { Router } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { validate } from "../middlewares/validate";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";

const router=Router();

const repository=new UserRepository();

const service=new AuthService(repository);

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



export default router;