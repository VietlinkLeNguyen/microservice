import { Request, Response } from "express";
import { Message } from "../database";
// import { AuthRequest } from "../middleware";
import Conversation from "../database/models/ConversationModel";
import { ApiError, handleMessageReceived } from "../utils";

const send = async (req: Request, res: Response) => {
  try {
    let { message, conversationId } = req.body;
    const { _id, email, name } = req.user;

    const conversation = await validateSendData(_id, conversationId);

    const newMessage = await Message.create({
      conversationId,
      senderId: _id,
      message,
    });

    const listReceivers = conversation.userIds.filter((id) => id !== _id);
    await handleMessageReceived(name, email, message, conversationId, listReceivers);

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

const validateSendData = async (senderId: string, conversationId: string) => {
  const existingConversation = await Conversation.findOne({
    _id: conversationId,
  });
  if (!existingConversation) {
    throw new Error("Conversation does not exist.");
  }
  const isInConversation = existingConversation.userIds.includes(senderId);
  console.log("existingConversation:", existingConversation, senderId, existingConversation.userIds);

  if (!isInConversation) {
    throw new ApiError(400, "User is not part of the conversation.");
  }
  return existingConversation;
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

    const conversations = await Conversation.find({
      userIds: { $in: [userId] },
    }).sort({ createdAt: -1 });
    res.json({
      status: 200,
      message: "Conversations retrieved successfully!",
      data: conversations,
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
    if (!userIds.includes(req.user._id)) {
      throw new ApiError(400, "User must be included in the conversation.");
    }

    const existingConversation = await Conversation.findOne({
      userIds: { $all: userIds },
    });
    console.log("existingConversation:", existingConversation);

    if (existingConversation) {
      throw new ApiError(400, "Conversation already exists.");
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
      status: error.statusCode || 500,
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
