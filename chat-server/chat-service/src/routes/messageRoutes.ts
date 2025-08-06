import { Router } from "express";
import MessageController from "../controllers/MessageController";
import { authMiddleware } from "../middleware";
import { validate } from "../validation";
import { createConversationSchema } from "../validation/schema";

const messageRoutes = Router();

messageRoutes.post("/send", authMiddleware, MessageController.send);
messageRoutes.post(
  "/conversation",
  [authMiddleware, validate(createConversationSchema)],
  MessageController.createConversation
);
messageRoutes.get("/get/:receiverId", authMiddleware, MessageController.getConversation);
messageRoutes.get("/get-conversations", authMiddleware, MessageController.getAllConversations);

export default messageRoutes;
