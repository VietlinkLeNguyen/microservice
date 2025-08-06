import { Request, Response } from "express";
import { Message } from "../database";
// import { AuthRequest } from "../middleware";
import Conversation from "../database/models/ConversationModel";
import { ApiError, handleMessageReceived } from "../utils";

const send = async (req: Request, res: Response) => {
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

    return void res.json({
      status: 200,
      message: "Message sent successfully!",
      data: newMessage,
    });
  } catch (error: any) {
    return void res.json({
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

const getConversation = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      senderId,
    });

    return void res.json({
      status: 200,
      message: "Messages retrieved successfully!",
      data: messages,
    });
  } catch (error: any) {
    return void res.json({
      status: 500,
      message: error.message,
    });
  }
};

const getAllConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const conversations = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });
    const uniqueConversations = Array.from(new Map(conversations.map((msg) => [msg.receiverId, msg])).values());
    res.json({
      status: 200,
      message: "Conversations retrieved successfully!",
      data: uniqueConversations,
    });
  } catch (error: any) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

const createConversation = async (req: Request, res: Response) => {
  try {
    const { userIds } = req.body;
    console.log("userIds:", userIds);

    // Check if userIds already have conversation
    const existingConversation = await Message.findOne({
      userIds: { $all: userIds },
    });
    console.log("existingConversation:", existingConversation);

    if (existingConversation) {
      res.json({
        status: 400,
        message: "Conversation already exists!",
        data: existingConversation,
      });
    }
    const newConversation = await Conversation.create({
      userIds,
    });
    res.json({
      status: 201,
      message: "Conversation created successfully!",
      data: newConversation,
    });
  } catch (error: any) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
};

export default {
  send,
  getConversation,
  createConversation,
  getAllConversations,
};
