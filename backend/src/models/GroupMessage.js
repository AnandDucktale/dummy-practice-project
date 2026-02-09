import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const groupMessageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    messageType: {
      type: String,
      required: true,
    },
    data: {
      type: String,
    },
    document: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
    },
  },
  {
    timestamps: true,
  },
);

const GroupMessage = model('GroupMessage', groupMessageSchema);
export default GroupMessage;
