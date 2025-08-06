import { Response } from "express";
import { Message } from "../database";
import { AuthRequest } from "../middleware";
import { ApiError, handleMessageReceived } from "../utils";

const send = async (req: AuthRequest, res: Response) => {
  try {
    let { receiverId, message, conversationId } = req.body;
    const { _id, email, name } = req.user;
    if (!conversationId) {
      // check if the conversation exists
      const existingConversation = await Message.findOne({
        $or: [
          { senderId: _id, receiverId },
          { senderId: receiverId, receiverId: _id },
        ],
      });

      if (!existingConversation) {
        // Create a new conversation if it doesn't exist
        const newConversation = await Message.create({
          senderId: _id,
          receiverId,
          message: "New conversation started",
        });
        conversationId = newConversation._id;
      }
    }

    validateReceiver(_id, conversationId, receiverId);

    const newMessage = await Message.create({
      conversationId,
      senderId: _id,
      receiverId,
      message,
    });

    await handleMessageReceived(name, email, receiverId, message, conversationId);

    return res.json({
      status: 200,
      message: "Message sent successfully!",
      data: newMessage,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

const validateReceiver = (senderId: string, conversationId: string, receiverId: string) => {
  if (!conversationId) {
    throw new ApiError(404, "Conversation ID is required.");
  }

  if (senderId == receiverId) {
    throw new ApiError(400, "Sender and receiver cannot be the same.");
  }
};

const getConversation = async (req: AuthRequest, res: Response) => {
  try {
    const { conversationId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      senderId,
    });

    return res.json({
      status: 200,
      message: "Messages retrieved successfully!",
      data: messages,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

const getAllConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const conversations = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });
    const uniqueConversations = Array.from(new Map(conversations.map((msg) => [msg.receiverId, msg])).values());
    return res.json({
      status: 200,
      message: "Conversations retrieved successfully!",
      data: uniqueConversations,
    });
  } catch (error: any) {
    return res.json({
      status: 500,
      message: error.message,
    });
  }
};

export default {
  send,
  getConversation,
  getAllConversations,
};
