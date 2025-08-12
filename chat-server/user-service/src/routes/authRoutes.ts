import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../validation";
import { createUserSchema } from "../validation/schema";

const userRouter = Router();

userRouter.post("/register", validate(createUserSchema), authController.register);
userRouter.post("/login", authController.login);
userRouter.get("/profile", authenticate, authController.getProfile);

export default userRouter;
