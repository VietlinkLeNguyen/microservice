import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  userIds: string[];
  lastMessageId: string;
}

const ConversationSchema: Schema = new Schema(
  {
    userIds: [{ type: String, required: true }],
    lastMessageId: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
export default Conversation;
