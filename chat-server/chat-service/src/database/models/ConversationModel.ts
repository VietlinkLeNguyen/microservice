import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {}

const ConversationSchema: Schema = new Schema({
  timestamps: true,
});

const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
export default Conversation;
