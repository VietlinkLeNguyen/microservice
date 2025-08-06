import { Router } from "express";
import { authController } from "../controllers/AuthController";
import { authenticate } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.post("/register", authenticate, authController.register);
userRouter.post("/login", authController.login);
userRouter.get("/profile", authenticate, authController.getProfile);

export default userRouter;
